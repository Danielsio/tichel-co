import { cn } from "@/lib/utils/cn";

export interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-stone animate-pulse",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 rounded-md",
        variant === "rectangular" && "rounded-xl",
        className,
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[3/4] w-full rounded-xl" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/3" />
    </div>
  );
}
