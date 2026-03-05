"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

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
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusable =
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;

        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);

      requestAnimationFrame(() => {
        const firstFocusable =
          panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        firstFocusable?.focus();
      });
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
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
          "bg-navy/40 fixed inset-0 backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionTimingFunction: "var(--ease-drawer)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "z-10 bg-white shadow-2xl transition-transform duration-300",
          styles.panel,
          isOpen ? styles.open : styles.closed,
          className,
        )}
        style={{ transitionTimingFunction: "var(--ease-drawer)" }}
      >
        {title && (
          <div className="border-stone/60 flex items-center justify-between border-b px-6 py-5">
            <h2 className="text-navy text-[13px] font-semibold tracking-[0.15em] uppercase">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-charcoal/30 hover:text-navy flex h-8 w-8 cursor-pointer items-center justify-center transition-colors duration-200"
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
