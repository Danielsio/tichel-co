"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format-price";
import type { OrderStatus } from "@/types";

interface OrderRow {
  id: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  guestEmail?: string;
  userId?: string;
  createdAt: { seconds: number } | null;
  items: { productTitle: string }[];
}

const STATUS_OPTIONS: OrderStatus[] = [
  "pending_payment",
  "payment_confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default function AdminOrdersPage() {
  const t = useTranslations("admin");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as OrderRow));
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-display text-navy text-3xl font-semibold">
            {t("orders")}
          </h1>
          <p className="text-charcoal/50 mt-1 text-[13px]">{t("manageOrders")}</p>
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48 text-[13px]"
        >
          <option value="all">{t("allStatuses")}</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-stone/60 border-b">
              <th className="text-charcoal/50 pe-4 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("order")}
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("status")}
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("items")}
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("total")}
              </th>
              <th className="text-charcoal/50 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-charcoal/30 py-16 text-center">
                  {t("loading")}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-charcoal/30 py-16 text-center">
                  {t("noOrders")}
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-stone/60 border-b transition-colors hover:bg-white/50"
                >
                  <td className="py-3.5 pe-4">
                    <Link
                      href={`/admin/orders/${order.id}` as never}
                      className="text-navy font-mono text-[12px] font-medium hover:underline"
                    >
                      {order.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="py-3.5 pe-4">
                    <Badge
                      variant={
                        order.status === "payment_confirmed" ||
                        order.status === "delivered"
                          ? "success"
                          : order.status === "cancelled"
                            ? "outOfStock"
                            : "default"
                      }
                    >
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="text-charcoal/50 py-3.5 pe-4 text-[12px]">
                    {t("itemsCount", { count: order.items?.length ?? 0 })}
                  </td>
                  <td className="text-navy py-3.5 pe-4 text-[12px] font-medium">
                    {formatPrice(order.totalCents)}
                  </td>
                  <td className="text-charcoal/50 py-3.5 text-[12px]">
                    {order.createdAt
                      ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(
                          "he-IL",
                        )
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
