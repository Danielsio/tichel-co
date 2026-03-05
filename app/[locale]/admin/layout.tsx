"use client";

import { type ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "@/lib/i18n/navigation";

const adminNavLinks = [
  { href: "/admin" as const, label: "לוח בקרה", icon: "◈" },
  { href: "/admin/orders" as const, label: "הזמנות", icon: "◆" },
  { href: "/admin/products" as const, label: "מוצרים", icon: "◇" },
  { href: "/admin/custom-requests" as const, label: "בקשות מיוחדות", icon: "✦" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { loading, isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="bg-ivory flex min-h-screen items-center justify-center">
        <div className="bg-stone/40 h-8 w-8 animate-pulse rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="bg-ivory flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <div className="text-navy font-display text-2xl font-semibold">אין הרשאה</div>
        <p className="text-charcoal/50 text-sm">
          לחשבון זה אין הרשאות ניהול. פנה למנהל המערכת.
        </p>
        <Link
          href="/"
          className="text-gold hover:text-gold-light mt-2 text-sm font-medium transition-colors"
        >
          ← חזרה לחנות
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="gradient-luxury order-last w-64 shrink-0">
        <div className="p-6 pt-8">
          <Link href="/" className="inline-block">
            <span className="font-display text-ivory text-xl font-semibold tracking-tight">
              Tichel & Co.
            </span>
          </Link>
          <p className="text-ivory/30 mt-1 text-[11px] tracking-[0.15em] uppercase">
            ניהול
          </p>
        </div>
        <nav className="mt-4 flex flex-col gap-0.5 px-3">
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ivory/50 hover:bg-ivory/10 hover:text-ivory flex items-center gap-3 px-3 py-3 text-[13px] font-medium transition-colors duration-200"
            >
              <span className="text-gold/60 text-xs">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-ivory/10 mx-3 mt-auto border-t pt-4">
          <Link
            href="/"
            className="text-ivory/30 hover:text-ivory/60 block px-3 py-3 text-[12px] transition-colors duration-200"
          >
            ← חזרה לחנות
          </Link>
        </div>
      </aside>

      <main className="bg-ivory flex-1 p-8 lg:p-10">{children}</main>
    </div>
  );
}
