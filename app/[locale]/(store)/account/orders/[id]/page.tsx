"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format-price";
import type { OrderStatus } from "@/types";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

interface OrderData {
  userId?: string;
  guestEmail?: string;
  status: OrderStatus;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  items: {
    productTitle: string;
    variantLabel: string;
    quantity: number;
    unitPriceCents: number;
    imageUrl: string;
  }[];
  shippingAddress?: {
    label?: string;
    line1: string;
    line2?: string;
    city: string;
    country: string;
    postalCode?: string;
  } | null;
  createdAt: { seconds: number } | null;
}

const TIMELINE_STEPS: OrderStatus[] = [
  "pending_payment",
  "payment_confirmed",
  "processing",
  "shipped",
  "delivered",
];

function StatusTimeline({
  current,
  t,
}: {
  current: OrderStatus;
  t: (key: string) => string;
}) {
  const isCancelled = current === "cancelled" || current === "refunded";
  const currentIdx = TIMELINE_STEPS.indexOf(current);

  return (
    <div className="mt-8">
      {isCancelled ? (
        <div className="bg-error/5 border-error/20 rounded-sm border p-4 text-center">
          <span className="text-error text-sm font-semibold">
            {t(`statusLabels.${current}`)}
          </span>
        </div>
      ) : (
        <div className="flex items-center">
          {TIMELINE_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isActive = idx === currentIdx;
            return (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                      isCompleted
                        ? "border-gold bg-gold text-ivory"
                        : "border-stone text-charcoal/30"
                    } ${isActive ? "ring-gold/30 ring-4" : ""}`}
                  >
                    {isCompleted ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`text-center text-[10px] leading-tight font-medium ${
                      isCompleted ? "text-navy" : "text-charcoal/30"
                    }`}
                  >
                    {t(`statusLabels.${step}`)}
                  </span>
                </div>
                {idx < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 flex-1 ${
                      idx < currentIdx ? "bg-gold" : "bg-stone"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const t = useTranslations("orders");
  const tCheckout = useTranslations("checkout");
  const tAuth = useTranslations("auth");
  const tAccount = useTranslations("account");
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "orders", id), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as OrderData;
        if (data.userId !== user.uid) {
          setAccessDenied(true);
        } else {
          setOrder(data);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id, user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
        <div className="bg-stone h-6 w-32 animate-pulse rounded" />
        <div className="bg-stone mt-6 h-10 w-64 animate-pulse rounded" />
        <div className="bg-stone mt-8 h-20 animate-pulse rounded" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-stone h-20 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-display text-navy text-2xl font-semibold">
            {tAccount("title")}
          </h1>
          <p className="text-charcoal/40 mt-3 text-sm">{tAuth("noAccount")}</p>
          <div className="mt-6">
            <Link href="/login">
              <Button size="lg" fullWidth>
                {tAuth("loginButton")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (accessDenied || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-6">
        <h1 className="font-display text-navy text-2xl font-semibold">
          {t("notFound")}
        </h1>
        <Link href="/account" className="mt-4 inline-block">
          <Button variant="secondary">{t("backToOrders")}</Button>
        </Link>
      </div>
    );
  }

  const orderDate = order.createdAt
    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      {/* Back link */}
      <Link
        href="/account"
        className="text-charcoal/50 hover:text-navy inline-flex items-center gap-1 text-sm transition-colors"
      >
        <svg
          className="h-4 w-4 rtl:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        {t("backToOrders")}
      </Link>

      {/* Header */}
      <div className="mt-6">
        <h1 className="font-display text-navy text-2xl font-semibold lg:text-3xl">
          {t("orderNumber", { id })}
        </h1>
        {orderDate && (
          <p className="text-charcoal/50 mt-1 text-sm">
            {t("placedOn", { date: orderDate })}
          </p>
        )}
      </div>

      {/* Status Timeline */}
      <StatusTimeline current={order.status} t={tCheckout} />

      {/* Items */}
      <div className="mt-10">
        <h2 className="text-navy mb-4 text-xs font-semibold tracking-[0.15em] uppercase">
          {t("items")}
        </h2>
        <div className="flex flex-col gap-4">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="border-stone flex items-center gap-4 border-b pb-4"
            >
              <div className="bg-stone relative h-20 w-16 shrink-0 overflow-hidden rounded-sm">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.productTitle}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-navy text-sm font-medium">{item.productTitle}</p>
                <p className="text-charcoal/50 mt-0.5 text-xs">
                  {item.variantLabel} · x{item.quantity}
                </p>
              </div>
              <div className="text-end">
                <p className="text-navy text-sm font-medium">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-charcoal/40 text-xs">
                    {formatPrice(item.unitPriceCents)} / {t("each")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section: address + summary */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-stone/50 rounded-sm p-5">
            <h3 className="text-navy mb-3 text-xs font-semibold tracking-[0.15em] uppercase">
              {t("shippingAddress")}
            </h3>
            <div className="text-charcoal/70 space-y-0.5 text-sm">
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
              {order.shippingAddress.postalCode && (
                <p>{order.shippingAddress.postalCode}</p>
              )}
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="bg-stone/50 rounded-sm p-5">
          <h3 className="text-navy mb-3 text-xs font-semibold tracking-[0.15em] uppercase">
            {t("priceSummary")}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="text-charcoal/70 flex justify-between">
              <span>{t("subtotal")}</span>
              <span>{formatPrice(order.subtotalCents)}</span>
            </div>
            <div className="text-charcoal/70 flex justify-between">
              <span>{t("shipping")}</span>
              <span>
                {order.shippingCents === 0
                  ? t("free")
                  : formatPrice(order.shippingCents)}
              </span>
            </div>
            {order.taxCents > 0 && (
              <div className="text-charcoal/70 flex justify-between">
                <span>{t("tax")}</span>
                <span>{formatPrice(order.taxCents)}</span>
              </div>
            )}
            <div className="border-stone border-t pt-2">
              <div className="text-navy flex justify-between font-semibold">
                <span>{t("total")}</span>
                <span>{formatPrice(order.totalCents)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to store */}
      <div className="mt-10 text-center">
        <Link href="/">
          <Button variant="secondary">{tCheckout("backToStore")}</Button>
        </Link>
      </div>
    </div>
  );
}
