"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  customRequests: number;
}

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState<Stats | null>(null);

  const statCards = [
    { key: "totalProducts" as const, label: t("totalProducts"), icon: "◇" },
    { key: "totalOrders" as const, label: t("totalOrders"), icon: "◆" },
    { key: "pendingOrders" as const, label: t("pendingOrders"), icon: "◈" },
    { key: "customRequests" as const, label: t("customRequests"), icon: "✦" },
  ];

  useEffect(() => {
    async function load() {
      try {
        const [products, orders, pending, custom] = await Promise.all([
          getCountFromServer(collection(db, "products")),
          getCountFromServer(collection(db, "orders")),
          getCountFromServer(
            query(collection(db, "orders"), where("status", "==", "pending_payment")),
          ),
          getCountFromServer(collection(db, "customRequests")),
        ]);
        setStats({
          totalProducts: products.data().count,
          totalOrders: orders.data().count,
          pendingOrders: pending.data().count,
          customRequests: custom.data().count,
        });
      } catch {
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          pendingOrders: 0,
          customRequests: 0,
        });
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-navy text-3xl font-semibold">
          {t("dashboard")}
        </h1>
        <p className="text-charcoal/50 mt-1 text-[13px]">{t("storeOverview")}</p>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {statCards.map((card) => (
          <article
            key={card.key}
            className="border-stone/60 border bg-white p-6 transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-charcoal/50 text-[11px] tracking-[0.12em] uppercase">
                {card.label}
              </p>
              <span className="text-gold/50 text-sm">{card.icon}</span>
            </div>
            <p className="text-navy mt-3 text-3xl font-semibold">
              {stats?.[card.key] ?? "—"}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
