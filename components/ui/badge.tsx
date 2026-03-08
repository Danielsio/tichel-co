import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "new" | "sale" | "outOfStock" | "success" | "warning";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-stone text-charcoal",
  new: "bg-navy text-ivory",
  sale: "bg-error/90 text-white",
  outOfStock: "bg-charcoal/10 text-charcoal/60",
  success: "bg-success/10 text-success",
  warning: "bg-gold/20 text-charcoal",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
