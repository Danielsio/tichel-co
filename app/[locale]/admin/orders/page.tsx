"use client";

import { useEffect, useState } from "react";
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
      <div className="flex items-center justify-between">
        <h1 className="text-navy text-2xl font-semibold">Orders</h1>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-stone border-b text-start">
              <th className="text-charcoal/50 pe-4 pb-3 text-xs font-semibold uppercase">
                Order
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-xs font-semibold uppercase">
                Status
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-xs font-semibold uppercase">
                Items
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-xs font-semibold uppercase">
                Total
              </th>
              <th className="text-charcoal/50 pb-3 text-xs font-semibold uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-charcoal/40 py-12 text-center">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-charcoal/40 py-12 text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-stone border-b">
                  <td className="py-3 pe-4">
                    <Link
                      href={`/account/orders/${order.id}` as never}
                      className="text-gold font-mono text-xs hover:underline"
                    >
                      {order.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="py-3 pe-4">
                    <Badge
                      variant={
                        order.status === "payment_confirmed" ||
                        order.status === "delivered"
                          ? "new"
                          : order.status === "cancelled"
                            ? "outOfStock"
                            : "sale"
                      }
                    >
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="text-charcoal/70 py-3 pe-4 text-xs">
                    {order.items?.length ?? 0} item(s)
                  </td>
                  <td className="text-navy py-3 pe-4 text-xs font-medium">
                    {formatPrice(order.totalCents)}
                  </td>
                  <td className="text-charcoal/50 py-3 text-xs">
                    {order.createdAt
                      ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
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
