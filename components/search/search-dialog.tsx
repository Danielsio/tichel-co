"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useUIStore } from "@/stores/ui-store";
import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";

interface SearchProduct {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  comparePriceCents?: number;
  imageUrl: string | null;
}

export function SearchDialog() {
  const t = useTranslations("search");
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const openSearch = useUIStore((s) => s.openSearch);

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search");
      const json = await res.json();
      if (json.data) setProducts(json.data);
    } catch {
      /* silently fail */
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [fetched]);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, fetchProducts]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSearch, openSearch]);

  const handleClose = () => {
    closeSearch();
    setQuery("");
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? products.filter((p) => p.title.toLowerCase().includes(normalizedQuery))
    : products;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="bg-navy/40 animate-in fade-in fixed inset-0 backdrop-blur-[2px] duration-200"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative mx-auto mt-[10vh] w-full max-w-xl px-4">
        <div className="animate-in slide-in-from-top-4 fade-in overflow-hidden rounded-lg bg-white shadow-2xl duration-200">
          {/* Search input */}
          <div className="border-stone flex items-center gap-3 border-b px-4">
            <svg
              className="text-charcoal/30 h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              className="text-navy placeholder:text-charcoal/30 h-14 flex-1 bg-transparent text-sm outline-none"
            />
            <kbd className="text-charcoal/25 border-stone hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-3 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-stone h-16 animate-pulse rounded" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-charcoal/40 text-sm">
                  {normalizedQuery ? t("noResults") : t("startTyping")}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}` as never}
                    onClick={handleClose}
                    className={cn(
                      "hover:bg-stone/50 flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
                    )}
                  >
                    <div className="bg-stone relative h-12 w-10 shrink-0 overflow-hidden rounded-sm">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-charcoal/15 text-[8px]">T&C</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-navy text-sm font-medium">{product.title}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-charcoal/60 text-xs">
                          {formatPrice(product.priceCents)}
                        </span>
                        {product.comparePriceCents && (
                          <span className="text-charcoal/30 text-xs line-through">
                            {formatPrice(product.comparePriceCents)}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg
                      className="text-charcoal/20 h-4 w-4 shrink-0 rtl:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
