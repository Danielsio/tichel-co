import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { locale, id: _id } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">Order Detail</h1>
      <p className="text-charcoal/60 mt-4">
        Order detail with live Firestore status tracking — Phase 4/5
      </p>
    </div>
  );
}
