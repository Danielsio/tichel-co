import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

const sizePx: Record<string, number> = { sm: 32, md: 40, lg: 56 };

export function Avatar({ src, alt, fallback, size = "md", className }: AvatarProps) {
  const initials = fallback
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={alt || fallback}
        width={sizePx[size]}
        height={sizePx[size]}
        className={cn(
          "inline-block shrink-0 rounded-full object-cover",
          sizeStyles[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "bg-gold/15 text-navy inline-flex shrink-0 items-center justify-center rounded-full font-medium",
        sizeStyles[size],
        className,
      )}
      aria-label={fallback}
    >
      {initials}
    </span>
  );
}
