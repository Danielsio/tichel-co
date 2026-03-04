import { Link } from "@/lib/i18n/navigation";

const adminNavLinks = [
  { href: "/admin" as const, label: "לוח בקרה", icon: "◈" },
  { href: "/admin/orders" as const, label: "הזמנות", icon: "◆" },
  { href: "/admin/products" as const, label: "מוצרים", icon: "◇" },
  { href: "/admin/custom-requests" as const, label: "בקשות מיוחדות", icon: "✦" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — appears on the right in RTL */}
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

      {/* Main Content */}
      <main className="bg-ivory flex-1 p-8 lg:p-10">{children}</main>
    </div>
  );
}
