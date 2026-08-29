import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "bg-secondary text-muted-foreground",
        new: "bg-secondary text-muted-foreground",
        call: "bg-accent/15 text-accent",
        called: "bg-secondary text-muted-foreground",
        callback: "bg-warm/15 text-warm",
        interested: "bg-ok/15 text-ok",
        follow: "bg-accent/15 text-accent",
        qualified: "bg-ok/20 text-ok",
        won: "bg-ok/25 text-ok",
        lost: "bg-destructive/15 text-destructive",
        dnc: "bg-destructive/20 text-destructive",
        hot: "bg-hot/15 text-hot",
        warm: "bg-warm/15 text-warm",
        cold: "bg-cold/15 text-cold",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
