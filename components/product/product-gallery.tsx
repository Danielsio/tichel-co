"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

interface ProductImage {
  url: string;
  altText?: string | null;
}

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const t = useTranslations("product");
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (images.length <= 1) return;
      const next = (idx: number) => {
        const nextIdx = Math.max(0, Math.min(idx, images.length - 1));
        setActiveIndex(nextIdx);
        thumbnailRefs.current[nextIdx]?.focus();
      };
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next(activeIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next(activeIndex - 1);
      }
    },
    [images.length, activeIndex],
  );

  if (images.length === 0) {
    return (
      <div className="bg-stone flex aspect-[3/4] items-center justify-center">
        <span className="font-display text-charcoal/10 text-2xl">Tichel & Co.</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
      {/* Main Image */}
      <div className="bg-stone group relative aspect-[3/4] flex-1 overflow-hidden">
        {activeImage && (
          <img
            src={activeImage.url}
            alt={activeImage.altText ?? t("productImage")}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="flex gap-2 md:w-[72px] md:flex-col"
          role="tablist"
          onKeyDown={handleKeyDown}
        >
          {images.map((image, idx) => (
            <button
              key={idx}
              ref={(el) => {
                thumbnailRefs.current[idx] = el;
              }}
              role="tab"
              aria-selected={activeIndex === idx}
              tabIndex={activeIndex === idx ? 0 : -1}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square w-16 shrink-0 cursor-pointer overflow-hidden transition-all duration-300 md:w-full",
                activeIndex === idx
                  ? "ring-navy opacity-100 ring-1"
                  : "opacity-40 hover:opacity-70",
              )}
            >
              <img
                src={image.url}
                alt={image.altText ?? t("imageNumber", { n: idx + 1 })}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
