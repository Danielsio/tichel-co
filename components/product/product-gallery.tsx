"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
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
      <div className="bg-stone flex aspect-[3/4] items-center justify-center rounded-2xl">
        <span className="font-display text-charcoal/10 text-2xl">Tichel & Co.</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
      {/* Main Image */}
      <div className="group bg-stone relative aspect-[3/4] flex-1 overflow-hidden rounded-2xl">
        {activeImage && (
          <Image
            src={activeImage.url}
            alt={activeImage.altText ?? t("productImage")}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={activeIndex === 0}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 md:hidden">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeIndex === idx ? "bg-navy w-6" : "bg-navy/20 w-1.5",
                )}
                aria-label={t("imageNumber", { n: idx + 1 })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="hidden gap-2 md:flex md:w-20 md:flex-col lg:w-[88px]"
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
                "relative aspect-square w-full shrink-0 cursor-pointer overflow-hidden rounded-xl transition-all duration-300",
                activeIndex === idx
                  ? "ring-navy ring-offset-ivory ring-2 ring-offset-2"
                  : "opacity-50 hover:opacity-80",
              )}
            >
              <Image
                src={image.url}
                alt={image.altText ?? t("imageNumber", { n: idx + 1 })}
                fill
                sizes="88px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
