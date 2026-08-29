import type { DuplicateMatch, ParsedRow, Prospect } from "./types";
import { normalizeName, normalizePhone } from "./normalize";

export function duplicateReasons(
  row: ParsedRow,
  existing: Pick<Prospect, "phoneNormalized" | "nameNormalized" | "city" | "phone">,
): string[] {
  const reasons: string[] = [];
  const phone = normalizePhone(row.values.phone ?? "");
  const name = normalizeName(row.values.businessName ?? "");
  const city = (row.values.city ?? "").trim().toLowerCase();
  if (phone && phone === existing.phoneNormalized) reasons.push("phone");
  if (name && name === existing.nameNormalized) {
    reasons.push("business name");
    if (city && city === existing.city.trim().toLowerCase()) {
      reasons.push("business name + city");
    }
  }
  if (phone && name && phone === existing.phoneNormalized && name === existing.nameNormalized) {
    reasons.push("business name + phone");
  }
  return Array.from(new Set(reasons));
}

export function findDuplicates(
  rows: ParsedRow[],
  existing: Prospect[],
): DuplicateMatch[] {
  const byPhone = new Map<string, Prospect>();
  const byName = new Map<string, Prospect[]>();
  for (const p of existing) {
    if (p.phoneNormalized) byPhone.set(p.phoneNormalized, p);
    if (p.nameNormalized) {
      const list = byName.get(p.nameNormalized) ?? [];
      list.push(p);
      byName.set(p.nameNormalized, list);
    }
  }

  const seenPhone = new Map<string, number>();
  const seenNameCity = new Map<string, number>();
  const matches: DuplicateMatch[] = [];

  rows.forEach((row, index) => {
    const phone = normalizePhone(row.values.phone ?? "");
    const name = normalizeName(row.values.businessName ?? "");
    const city = (row.values.city ?? "").trim().toLowerCase();
    const reasons: string[] = [];
    let existingHit: Prospect | null = null;
    let incomingDuplicateOf: number | null = null;

    if (phone && byPhone.has(phone)) {
      existingHit = byPhone.get(phone) ?? null;
      reasons.push("phone");
    }
    if (name) {
      const candidates = byName.get(name) ?? [];
      const cityMatch = candidates.find(
        (c) => city && c.city.trim().toLowerCase() === city,
      );
      const any = cityMatch ?? candidates[0];
      if (any) {
        existingHit = existingHit ?? any;
        reasons.push("business name");
        if (cityMatch) reasons.push("business name + city");
        if (phone && any.phoneNormalized === phone) reasons.push("business name + phone");
      }
    }

    if (phone && seenPhone.has(phone)) {
      incomingDuplicateOf = seenPhone.get(phone) ?? null;
      reasons.push("phone (in file)");
    }
    const nameCityKey = name ? `${name}::${city}` : "";
    if (nameCityKey && seenNameCity.has(nameCityKey)) {
      incomingDuplicateOf = incomingDuplicateOf ?? seenNameCity.get(nameCityKey) ?? null;
      reasons.push("business name (in file)");
    }

    if (phone) seenPhone.set(phone, seenPhone.get(phone) ?? index);
    if (nameCityKey) seenNameCity.set(nameCityKey, seenNameCity.get(nameCityKey) ?? index);

    if (reasons.length > 0) {
      matches.push({
        incomingIndex: index,
        existingId: existingHit?.id ?? null,
        incomingDuplicateOf,
        reasons: Array.from(new Set(reasons)),
        existing: existingHit,
      });
    }
  });

  return matches;
}

export function isIncomplete(row: ParsedRow): string | null {
  const name = (row.values.businessName ?? "").trim();
  const phone = normalizePhone(row.values.phone ?? "");
  if (!name && !phone) return "Missing business name and phone";
  return null;
}
