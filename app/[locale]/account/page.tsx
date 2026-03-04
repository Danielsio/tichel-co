"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { Link } from "@/lib/i18n/navigation";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const t = useTranslations("account");
  const tAuth = useTranslations("auth");
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 lg:px-6">
        <div className="bg-stone h-8 w-48 animate-pulse rounded" />
        <div className="bg-stone mt-6 h-40 animate-pulse rounded" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20 text-center lg:px-6">
        <h1 className="font-display text-navy text-2xl font-semibold">{t("title")}</h1>
        <p className="text-charcoal/60 mt-3 text-sm">{tAuth("noAccount")}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/login">
            <Button size="lg" fullWidth>
              {tAuth("loginButton")}
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="lg" fullWidth>
              {tAuth("registerButton")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">
        {t("welcome", { name: user.displayName || user.email?.split("@")[0] || "" })}
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders/latest"
          className="border-stone hover:border-gold/30 rounded-sm border p-6 transition-colors"
        >
          <h3 className="text-navy text-sm font-semibold">{t("orders")}</h3>
          <p className="text-charcoal/50 mt-1 text-xs">View your order history</p>
        </Link>

        <div className="border-stone rounded-sm border p-6">
          <h3 className="text-navy text-sm font-semibold">{t("addresses")}</h3>
          <p className="text-charcoal/50 mt-1 text-xs">Manage shipping addresses</p>
        </div>

        <div className="border-stone rounded-sm border p-6">
          <h3 className="text-navy text-sm font-semibold">{t("wishlist")}</h3>
          <p className="text-charcoal/50 mt-1 text-xs">Your saved items</p>
        </div>

        <div className="border-stone rounded-sm border p-6">
          <h3 className="text-navy text-sm font-semibold">{t("settings")}</h3>
          <p className="text-charcoal/50 mt-1 text-xs">{user.email}</p>
        </div>
      </div>

      <div className="mt-8">
        <Button variant="ghost" onClick={handleLogout}>
          {tAuth("logoutButton")}
        </Button>
      </div>
    </div>
  );
}
