"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

interface ProductImage {
  url: string;
  altText?: string | null;
}

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const t = useTranslations("product");
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-stone flex aspect-[3/4] items-center justify-center rounded-sm">
        <span className="font-display text-charcoal/15 text-2xl">Tichel & Co.</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
      <div className="bg-stone relative aspect-[3/4] flex-1 overflow-hidden rounded-sm">
        {activeImage && (
          <img
            src={activeImage.url}
            alt={activeImage.altText ?? t("productImage")}
            className="h-full w-full object-cover transition-opacity duration-250"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 md:w-20 md:flex-col">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square w-16 shrink-0 cursor-pointer overflow-hidden rounded-sm border-2 transition-all md:w-full",
                activeIndex === idx
                  ? "border-gold"
                  : "border-transparent opacity-60 hover:opacity-100",
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
