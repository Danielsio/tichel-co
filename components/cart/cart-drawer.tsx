"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format-price";

const CartItemRow = memo(function CartItemRow({ item }: { item: CartItem }) {
  const t = useTranslations("cart");
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-5">
      <div className="bg-stone relative h-24 w-20 shrink-0 overflow-hidden rounded-lg">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-navy text-[13px] leading-snug font-medium">
              {item.name}
            </p>
            {(item.color || item.size) && (
              <p className="text-charcoal/40 mt-1 text-[11px]">
                {[item.color, item.size].filter(Boolean).join(" / ")}
              </p>
            )}
          </div>
          <button
            onClick={() => removeItem(item.variantId)}
            className="text-charcoal/25 hover:text-error -me-1 shrink-0 cursor-pointer rounded-md p-1 transition-colors"
            aria-label={t("removeItem", { name: item.name })}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="border-stone hover:border-navy/20 hover:bg-navy/5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-s-lg border text-[14px] transition-all"
              aria-label={t("decrease")}
            >
              −
            </button>
            <span className="border-stone flex h-8 w-9 items-center justify-center border-y text-[12px] font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="border-stone hover:border-navy/20 hover:bg-navy/5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-e-lg border text-[14px] transition-all"
              aria-label={t("increase")}
            >
              +
            </button>
          </div>
          <p className="text-navy text-[13px] font-semibold">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
});

export function CartDrawer() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const { items, isOpen, closeCart, totalPrice } = useCartStore();
  const mounted = useMounted();

  if (!mounted) return null;

  const total = totalPrice();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeCart}
      title={t("title")}
      side="start"
      closeLabel={tCommon("close")}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-stone mb-5 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-charcoal/20 h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
          <p className="text-charcoal/40 text-[13px]">{t("empty")}</p>
          <button
            onClick={closeCart}
            className="text-navy mt-4 cursor-pointer text-[13px] font-medium underline underline-offset-4 hover:no-underline"
          >
            {t("continueShopping")}
          </button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="divide-stone/60 -mx-6 flex-1 divide-y overflow-y-auto px-6">
            {items.map((item) => (
              <CartItemRow key={item.variantId} item={item} />
            ))}
          </div>

          <div className="border-stone/60 -mx-6 border-t bg-white px-6 pt-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-navy text-[13px] font-semibold">{t("total")}</span>
              <span className="text-navy text-lg font-semibold">
                {formatPrice(total)}
              </span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <Button fullWidth size="lg">
                {t("checkout")}
              </Button>
            </Link>
            <button
              onClick={closeCart}
              className="text-charcoal/40 hover:text-navy mt-3 w-full cursor-pointer pb-2 text-center text-[12px] font-medium transition-colors"
            >
              {t("continueShopping")}
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
