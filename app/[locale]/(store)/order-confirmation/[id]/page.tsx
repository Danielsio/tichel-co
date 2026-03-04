import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { locale, id: _id } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">Order Confirmed</h1>
      <p className="text-charcoal/60 mt-4">
        Order confirmation with real-time Firestore status — Phase 4
      </p>
    </div>
  );
}
