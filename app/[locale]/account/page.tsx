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
      <div className="mx-auto max-w-2xl px-4 py-20 lg:px-6">
        <div className="bg-stone h-8 w-48 animate-pulse" />
        <div className="bg-stone mt-8 h-48 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-display text-navy text-2xl font-semibold lg:text-3xl">
            {t("title")}
          </h1>
          <p className="text-charcoal/40 mt-3 text-[13px]">{tAuth("noAccount")}</p>
          <div className="mt-8 flex flex-col gap-3">
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
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6 lg:py-24">
      <h1 className="font-display text-navy text-3xl font-semibold lg:text-4xl">
        {t("welcome", { name: user.displayName || user.email?.split("@")[0] || "" })}
      </h1>

      <div className="border-stone/60 mt-2 border-t" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders/latest"
          className="group border-stone/60 hover:border-navy/20 border p-7 transition-all duration-300"
        >
          <h3 className="text-navy text-[13px] font-semibold tracking-wide">
            {t("orders")}
          </h3>
          <p className="text-charcoal/40 mt-1.5 text-[12px]">
            {t("ordersDesc", { fallback: "View your order history" })}
          </p>
          <span className="text-navy/40 group-hover:text-navy mt-4 block text-[11px] font-medium tracking-[0.15em] uppercase transition-colors duration-300">
            →
          </span>
        </Link>

        <div className="border-stone/60 border p-7">
          <h3 className="text-navy text-[13px] font-semibold tracking-wide">
            {t("addresses")}
          </h3>
          <p className="text-charcoal/40 mt-1.5 text-[12px]">
            Manage shipping addresses
          </p>
        </div>

        <div className="border-stone/60 border p-7">
          <h3 className="text-navy text-[13px] font-semibold tracking-wide">
            {t("wishlist")}
          </h3>
          <p className="text-charcoal/40 mt-1.5 text-[12px]">Your saved items</p>
        </div>

        <div className="border-stone/60 border p-7">
          <h3 className="text-navy text-[13px] font-semibold tracking-wide">
            {t("settings")}
          </h3>
          <p className="text-charcoal/40 mt-1.5 text-[12px]">{user.email}</p>
        </div>
      </div>

      <div className="mt-10">
        <Button variant="ghost" onClick={handleLogout}>
          {tAuth("logoutButton")}
        </Button>
      </div>
    </div>
  );
}
