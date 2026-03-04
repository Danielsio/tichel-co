"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "link";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-navy text-ivory hover:bg-navy/90 active:scale-[0.98] border border-navy",
  secondary:
    "bg-transparent text-navy border border-navy/20 hover:border-navy hover:bg-navy hover:text-ivory active:scale-[0.98]",
  ghost:
    "bg-transparent text-navy hover:bg-navy/5 active:scale-[0.98] border border-transparent",
  destructive:
    "bg-transparent text-error border border-error/30 hover:border-error hover:bg-error hover:text-white active:scale-[0.98]",
  link: "bg-transparent text-navy underline-offset-4 hover:underline border-none p-0 h-auto font-medium",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[12px] tracking-wider",
  md: "h-12 px-6 text-[13px] tracking-wide",
  lg: "h-14 px-10 text-[13px] tracking-wider",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-body inline-flex cursor-pointer items-center justify-center gap-2 font-medium uppercase transition-all duration-300 ease-out",
          "disabled:pointer-events-none disabled:opacity-40",
          variantStyles[variant],
          variant !== "link" && sizeStyles[size],
          fullWidth && "w-full",
          isLoading && "pointer-events-none",
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
