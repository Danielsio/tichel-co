import { Link } from "@/lib/i18n/navigation";

const adminNavLinks = [
  { href: "/admin" as const, label: "Dashboard" },
  { href: "/admin/orders" as const, label: "Orders" },
  { href: "/admin/products" as const, label: "Products" },
  { href: "/admin/custom-requests" as const, label: "Custom Requests" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen" dir="ltr">
      <aside className="border-stone w-64 shrink-0 border-r bg-white">
        <div className="p-6">
          <Link href="/" className="font-display text-navy text-xl font-semibold">
            Tichel & Co.
          </Link>
          <p className="text-charcoal/50 mt-1 text-xs">Admin Panel</p>
        </div>
        <nav className="px-3 pb-6">
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-charcoal/70 hover:bg-stone hover:text-navy block rounded-sm px-3 py-2.5 text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-stone border-t px-6 py-4">
          <Link
            href="/"
            className="text-charcoal/40 hover:text-gold text-xs transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>
      <main className="bg-ivory flex-1 p-8">{children}</main>
    </div>
  );
}
