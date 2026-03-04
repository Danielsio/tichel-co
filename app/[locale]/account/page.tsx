import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">My Account</h1>
      <p className="text-charcoal/60 mt-4">
        Account dashboard with orders, wishlist, profile — Phase 3/5
      </p>
    </div>
  );
}
