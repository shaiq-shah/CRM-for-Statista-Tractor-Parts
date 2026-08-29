import { displayPhone, telHref } from "@/lib/crm/normalize";
import { cn } from "@/lib/utils";

export function PhoneLink({
  phone,
  className,
}: {
  phone: string;
  className?: string;
}) {
  const href = telHref(phone);
  const label = displayPhone(phone);
  if (!href) return <span className={cn("font-mono text-sm text-muted-foreground", className)}>{label}</span>;
  return (
    <a
      href={href}
      className={cn(
        "font-mono text-sm text-foreground underline-offset-4 hover:text-accent hover:underline",
        className,
      )}
    >
      {label}
    </a>
  );
}
