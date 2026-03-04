import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "new" | "sale" | "outOfStock" | "success" | "warning";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-stone text-charcoal",
  new: "bg-blush text-navy",
  sale: "bg-gold/15 text-gold",
  outOfStock: "bg-error/10 text-error",
  success: "bg-success/10 text-success",
  warning: "bg-gold/20 text-charcoal",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-[0.08em] uppercase",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
