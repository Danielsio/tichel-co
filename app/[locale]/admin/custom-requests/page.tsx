import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminCustomRequestsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <h1 className="text-navy text-2xl font-semibold">Custom Requests</h1>
      <p className="text-charcoal/60 mt-2">Custom design request queue — Phase 5</p>
    </div>
  );
}
