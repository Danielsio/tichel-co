import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AdminProductDetailPage({ params }: Props) {
  const { locale, id: _id } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <h1 className="text-navy text-2xl font-semibold">Edit Product</h1>
      <p className="text-charcoal/60 mt-2">
        Product edit form with variants and image upload — Phase 5
      </p>
    </div>
  );
}
