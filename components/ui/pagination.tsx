"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const t = useTranslations("common");

  const handlePrev = useCallback(
    () => onPageChange(currentPage - 1),
    [currentPage, onPageChange],
  );
  const handleNext = useCallback(
    () => onPageChange(currentPage + 1),
    [currentPage, onPageChange],
  );
  const handlePageClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const page = Number((e.currentTarget as HTMLButtonElement).dataset.page);
      onPageChange(page);
    },
    [onPageChange],
  );

  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label={t("pagination")}
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1}
        className="text-charcoal/60 hover:bg-stone flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm transition-colors disabled:pointer-events-none disabled:opacity-30"
        aria-label={t("previousPage")}
      >
        <svg
          className="h-4 w-4 rtl:rotate-180"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="text-charcoal/40 flex h-10 w-10 items-center justify-center"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            data-page={page}
            onClick={handlePageClick}
            className={cn(
              "flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm text-sm font-medium transition-colors",
              currentPage === page
                ? "bg-navy text-ivory"
                : "text-charcoal/60 hover:bg-stone",
            )}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className="text-charcoal/60 hover:bg-stone flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm transition-colors disabled:pointer-events-none disabled:opacity-30"
        aria-label={t("nextPage")}
      >
        <svg
          className="h-4 w-4 rtl:rotate-180"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, 4, "...", total];
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}
