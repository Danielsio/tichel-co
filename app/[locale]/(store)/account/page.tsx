"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { Link } from "@/lib/i18n/navigation";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function AddressesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function WishlistIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

interface AccountCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  interactive?: boolean;
  badge?: string;
}

function AccountCard({
  icon,
  title,
  description,
  interactive = false,
  badge,
}: AccountCardProps) {
  return (
    <div
      className={`glass-card group relative overflow-hidden rounded-sm p-8 transition-all duration-400 ${
        interactive ? "hover-lift cursor-pointer" : ""
      }`}
    >
      <div className={`mb-4 ${interactive ? "text-gold" : "text-gold/50"}`}>{icon}</div>
      <h3 className="font-display text-navy text-lg font-semibold">{title}</h3>
      <p className="text-charcoal/50 mt-2 text-[13px] leading-relaxed">{description}</p>
      {interactive ? (
        <span className="text-gold/0 group-hover:text-gold mt-5 inline-block text-[12px] font-medium tracking-[0.2em] uppercase transition-all duration-300">
          →
        </span>
      ) : badge ? (
        <span className="text-charcoal/25 mt-5 inline-block text-[11px] font-medium tracking-[0.2em] uppercase">
          {badge}
        </span>
      ) : null}
      {interactive && (
        <div className="bg-gold/5 group-hover:bg-gold/10 pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
      )}
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-6 lg:py-24">
      <div className="flex flex-col items-center">
        <div className="bg-stone h-20 w-20 animate-pulse rounded-full" />
        <div className="bg-stone mt-6 h-8 w-56 animate-pulse rounded" />
        <div className="bg-stone mt-3 h-4 w-36 animate-pulse rounded" />
        <div className="bg-stone mt-5 h-[2px] w-12" />
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-sm p-8">
            <div className="bg-stone h-6 w-6 animate-pulse rounded" />
            <div className="bg-stone mt-4 h-5 w-28 animate-pulse rounded" />
            <div className="bg-stone mt-3 h-4 w-full animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const t = useTranslations("account");
  const tAuth = useTranslations("auth");
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <AccountSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="animate-fade-in w-full max-w-sm text-center">
          <div className="bg-gold/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-gold h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="font-display text-navy mt-6 text-2xl font-semibold lg:text-3xl">
            {t("title")}
          </h1>
          <p className="text-charcoal/40 mt-3 text-[13px] leading-relaxed">
            {tAuth("noAccount")}
          </p>
          <div className="bg-gold mx-auto mt-5 h-[2px] w-10" />
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

  const displayName = user.displayName || user.email?.split("@")[0] || "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-6 lg:py-24">
      <div className="animate-fade-in flex flex-col items-center text-center">
        <Avatar
          src={user.photoURL}
          fallback={displayName}
          size="lg"
          className="ring-gold/20 ring-offset-ivory h-20 w-20 text-lg ring-2 ring-offset-4"
        />
        <h1 className="font-display text-navy mt-6 text-3xl font-semibold lg:text-4xl">
          {t("welcome", { name: displayName })}
        </h1>
        <p className="text-charcoal/50 mt-2 text-sm">{user.email}</p>
        <div className="bg-gold mx-auto mt-5 h-[2px] w-12" />
      </div>

      <div className="animate-fade-up mt-14 grid gap-5 sm:grid-cols-2">
        <Link href="/account/orders/latest" className="block">
          <AccountCard
            icon={<OrdersIcon className="h-6 w-6" />}
            title={t("orders")}
            description={t("ordersDesc")}
            interactive
          />
        </Link>

        <AccountCard
          icon={<AddressesIcon className="h-6 w-6" />}
          title={t("addresses")}
          description={t("addressesDesc")}
          badge={t("comingSoon")}
        />

        <AccountCard
          icon={<WishlistIcon className="h-6 w-6" />}
          title={t("wishlist")}
          description={t("wishlistDesc")}
          badge={t("comingSoon")}
        />

        <AccountCard
          icon={<SettingsIcon className="h-6 w-6" />}
          title={t("settings")}
          description={t("settingsDesc")}
          badge={t("comingSoon")}
        />
      </div>

      <div className="animate-fade-in mt-16 flex justify-center">
        <button
          onClick={handleLogout}
          className="text-charcoal/35 hover:text-error group inline-flex cursor-pointer items-center gap-2.5 text-[12px] font-medium tracking-[0.15em] uppercase transition-colors duration-300"
        >
          <LogoutIcon />
          {tAuth("logoutButton")}
        </button>
      </div>
    </div>
  );
}
