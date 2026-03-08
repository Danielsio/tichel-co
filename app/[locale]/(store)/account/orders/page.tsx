"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format-price";
import type { OrderStatus } from "@/types";

interface OrderSummary {
  id: string;
  status: OrderStatus;
  totalCents: number;
  items: { productTitle: string; imageUrl: string; quantity: number }[];
  createdAt: { seconds: number } | null;
}

const STATUS_KEYS: OrderStatus[] = [
  "pending_payment",
  "payment_confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default function OrdersListPage() {
  const t = useTranslations("orders");
  const tCheckout = useTranslations("checkout");
  const tAuth = useTranslations("auth");
  const tAccount = useTranslations("account");
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as OrderSummary));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
        <div className="bg-stone h-8 w-40 animate-pulse rounded" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-stone h-24 animate-pulse rounded" />
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
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

      <h1 className="font-display text-navy mt-6 text-2xl font-semibold lg:text-3xl">
        {tAccount("orders")}
      </h1>

      {orders.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-charcoal/40 text-sm">{t("noOrders")}</p>
          <Link href="/" className="mt-6 inline-block">
            <Button variant="secondary">{tCheckout("backToStore")}</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => {
            const statusLabel = STATUS_KEYS.includes(order.status)
              ? tCheckout(`statusLabels.${order.status}`)
              : order.status;
            const statusColor =
              order.status === "delivered" || order.status === "payment_confirmed"
                ? "text-success"
                : order.status === "cancelled" || order.status === "refunded"
                  ? "text-error"
                  : "text-gold";
            const orderDate = order.createdAt
              ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "";

            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}` as never}
                className="border-stone hover:border-gold/30 group flex items-center gap-4 rounded-sm border p-4 transition-colors"
              >
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-stone relative h-14 w-11 shrink-0 overflow-hidden rounded-sm border-2 border-white"
                    >
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.productTitle}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-navy text-sm font-medium">
                      {t("orderNumber", { id: order.id.slice(0, 8) })}
                    </p>
                    <span className={`text-xs font-semibold ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div className="text-charcoal/50 mt-1 flex items-center gap-2 text-xs">
                    {orderDate && <span>{orderDate}</span>}
                    <span>·</span>
                    <span>{formatPrice(order.totalCents)}</span>
                  </div>
                </div>
                <svg
                  className="text-charcoal/20 group-hover:text-gold h-5 w-5 shrink-0 transition-colors rtl:rotate-180"
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
            );
          })}
        </div>
      )}
    </div>
  );
}
