import {
  format,
  isToday,
  isTomorrow,
  startOfDay,
  endOfDay,
  addDays,
  addMinutes,
  parseISO,
  isValid,
} from "date-fns";

export function nowIso(): string {
  return new Date().toISOString();
}

export function startOfTodayIso(): string {
  return startOfDay(new Date()).toISOString();
}

export function endOfTodayIso(): string {
  return endOfDay(new Date()).toISOString();
}

export function startOfTomorrowIso(): string {
  return startOfDay(addDays(new Date(), 1)).toISOString();
}

export function endOfTomorrowIso(): string {
  return endOfDay(addDays(new Date(), 1)).toISOString();
}

export function parseMaybeDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === "number") {
    const d = new Date(value);
    return isValid(d) ? d : null;
  }
  const raw = String(value).trim();
  if (!raw) return null;
  const iso = parseISO(raw);
  if (isValid(iso)) return iso;
  const d = new Date(raw);
  return isValid(d) ? d : null;
}

export function toIso(value: unknown): string | null {
  const d = parseMaybeDate(value);
  return d ? d.toISOString() : null;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parseMaybeDate(iso);
  if (!d) return "—";
  return format(d, "d MMM yyyy — h:mm a");
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parseMaybeDate(iso);
  if (!d) return "—";
  return format(d, "d MMM yyyy");
}

export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parseMaybeDate(iso);
  if (!d) return "—";
  return format(d, "h:mm a");
}

export function formatTimeShort(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parseMaybeDate(iso);
  if (!d) return "—";
  return format(d, "h:mm a");
}

export function formatRelativeDay(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parseMaybeDate(iso);
  if (!d) return "—";
  if (isToday(d)) return `Today · ${format(d, "h:mm a")}`;
  if (isTomorrow(d)) return `Tomorrow · ${format(d, "h:mm a")}`;
  return format(d, "d MMM yyyy — h:mm a");
}

export function datetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = parseMaybeDate(iso);
  if (!d) return "";
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

export function fromDatetimeLocal(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return isValid(d) ? d.toISOString() : null;
}

export function defaultCallbackIso(minutes: number): string {
  return addMinutes(new Date(), minutes).toISOString();
}

export function isOverdue(iso: string | null | undefined, now = new Date()): boolean {
  if (!iso) return false;
  const d = parseMaybeDate(iso);
  if (!d) return false;
  return d.getTime() < now.getTime();
}
