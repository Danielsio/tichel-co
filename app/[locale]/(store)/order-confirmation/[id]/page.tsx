"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format-price";
import type { OrderStatus } from "@/types";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

interface OrderData {
  status: OrderStatus;
  totalCents: number;
  items: {
    productTitle: string;
    variantLabel: string;
    quantity: number;
    unitPriceCents: number;
    imageUrl: string;
  }[];
  shippingAddress?: {
    line1: string;
    city: string;
    country: string;
  } | null;
  createdAt: { seconds: number } | null;
}

const STATUS_KEYS = [
  "pending_payment",
  "payment_confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export default function OrderConfirmationPage({ params }: Props) {
  const { id } = use(params);
  const t = useTranslations("checkout");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "orders", id), (snap) => {
      if (snap.exists()) {
        setOrder(snap.data() as OrderData);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 lg:px-6">
        <div className="bg-stone h-64 animate-pulse rounded-sm" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center lg:px-6">
        <h1 className="font-display text-navy text-2xl font-semibold">
          {t("orderNotFound")}
        </h1>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="secondary">{t("backToStore")}</Button>
        </Link>
      </div>
    );
  }

  const statusLabel = STATUS_KEYS.includes(order.status as (typeof STATUS_KEYS)[number])
    ? t(`statusLabels.${order.status}`)
    : order.status;
  const statusColor =
    order.status === "payment_confirmed" || order.status === "delivered"
      ? "text-success"
      : order.status === "cancelled" || order.status === "refunded"
        ? "text-error"
        : "text-gold";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 lg:px-6">
      <div className="text-center">
        <div className="text-success mx-auto mb-4 text-4xl">✓</div>
        <h1 className="font-display text-navy text-3xl font-semibold">
          {t("orderConfirmed")}
        </h1>
        <p className="text-charcoal/60 mt-2 text-sm">{t("orderNumber", { id })}</p>
      </div>

      {/* Status */}
      <div className="bg-stone mt-8 rounded-sm p-6 text-center">
        <p className="text-charcoal/50 text-xs tracking-wider uppercase">
          {t("status")}
        </p>
        <p className={`mt-1 text-lg font-semibold ${statusColor}`}>{statusLabel}</p>
      </div>

      {/* Items */}
      <div className="mt-6 flex flex-col gap-3">
        {order.items?.map((item, idx) => (
          <div key={idx} className="border-stone flex items-center gap-3 border-b pb-3">
            <div className="bg-stone h-14 w-11 shrink-0 overflow-hidden rounded-sm">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.productTitle}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-navy text-sm font-medium">{item.productTitle}</p>
              <p className="text-charcoal/50 text-xs">
                {item.variantLabel} · ×{item.quantity}
              </p>
            </div>
            <span className="text-charcoal/70 text-sm">
              {formatPrice(item.unitPriceCents * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-stone mt-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-navy font-semibold">{t("orderSummary")}</span>
          <span className="text-navy text-lg font-semibold">
            {formatPrice(order.totalCents)}
          </span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="secondary">{t("backToStore")}</Button>
        </Link>
      </div>
    </div>
  );
}
