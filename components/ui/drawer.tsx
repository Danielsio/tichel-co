"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type DrawerSide = "start" | "end" | "bottom";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: DrawerSide;
  className?: string;
  closeLabel?: string;
}

const sideStyles: Record<DrawerSide, { panel: string; open: string; closed: string }> =
  {
    start: {
      panel: "fixed inset-y-0 start-0 w-full max-w-md",
      open: "translate-x-0",
      closed: "rtl:translate-x-full ltr:-translate-x-full",
    },
    end: {
      panel: "fixed inset-y-0 end-0 w-full max-w-md",
      open: "translate-x-0",
      closed: "rtl:-translate-x-full ltr:translate-x-full",
    },
    bottom: {
      panel: "fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg",
      open: "translate-y-0",
      closed: "translate-y-full",
    },
  };

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = "start",
  className,
  closeLabel = "Close",
}: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const styles = sideStyles[side];

  return (
    <div
      className={cn("fixed inset-0 z-50", isOpen ? "visible" : "invisible")}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={cn(
          "bg-navy/50 fixed inset-0 transition-opacity duration-350",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionTimingFunction: "var(--ease-drawer)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "z-10 bg-white shadow-xl transition-transform duration-350",
          styles.panel,
          isOpen ? styles.open : styles.closed,
          className,
        )}
        style={{ transitionTimingFunction: "var(--ease-drawer)" }}
      >
        {title && (
          <div className="border-stone flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-body text-navy text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-charcoal/50 hover:bg-stone hover:text-charcoal flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm transition-colors"
              aria-label={closeLabel}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
