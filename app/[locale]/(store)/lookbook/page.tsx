import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getPublishedProducts } from "@/lib/firebase/admin-queries";
import type { StoreProduct } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

const LOOKS = [
  {
    title: "אלגנטיות שבתית",
    description: "שילוב של קטיפה עשירה עם סיכות פנינה לשבת מושלמת",
    imageUrl:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1200&q=80",
    productIds: ["prod-002", "prod-009"],
  },
  {
    title: "קלילות יומיומית",
    description: "פשתן נושם וסרט משי — מראה טבעי ורענן לכל יום",
    imageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80",
    productIds: ["prod-004", "prod-007"],
  },
  {
    title: "חלום ורוד",
    description: "שיפון משי ורוד עם גימור עדין — ליום מיוחד או סתם כי מגיע לך",
    imageUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
    productIds: ["prod-011", "prod-001"],
  },
];

export default async function LookbookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allProducts = await getPublishedProducts();

  return <LookbookContent allProducts={allProducts} />;
}

function LookbookContent({ allProducts }: { allProducts: StoreProduct[] }) {
  const t = useTranslations("lookbook");

  return (
    <>
      {/* Header */}
      <section className="bg-stone py-16">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <h1 className="font-display text-navy text-4xl font-semibold md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-charcoal/60 mx-auto mt-4 max-w-md text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Looks */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="flex flex-col gap-20">
          {LOOKS.map((look, idx) => {
            const products = look.productIds
              .map((id) => allProducts.find((p) => p.id === id))
              .filter(Boolean) as StoreProduct[];
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={idx}
                className={`flex flex-col gap-8 md:items-center lg:flex-row lg:gap-12 ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className="bg-stone relative aspect-[4/5] overflow-hidden rounded-sm lg:flex-1">
                  <Image
                    src={look.imageUrl}
                    alt={look.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center lg:flex-1">
                  <h2 className="font-display text-navy text-2xl font-semibold md:text-3xl">
                    {look.title}
                  </h2>
                  <p className="text-charcoal/60 mt-3 text-sm leading-relaxed">
                    {look.description}
                  </p>

                  {/* Products in this look */}
                  <div className="mt-8 flex flex-col gap-4">
                    {products.map((product) => {
                      const variant = product.variants[0];
                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}` as never}
                          className="border-stone group hover:border-gold/30 flex items-center gap-4 rounded-sm border p-3 transition-colors"
                        >
                          <div className="bg-stone relative h-16 w-12 shrink-0 overflow-hidden rounded-sm">
                            {variant?.imageUrls[0] && (
                              <Image
                                src={variant.imageUrls[0]}
                                alt={product.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-navy group-hover:text-gold text-sm font-medium transition-colors">
                              {product.title}
                            </h3>
                            <p className="text-charcoal/50 mt-0.5 text-xs">
                              {variant?.fabric}
                            </p>
                          </div>
                          <span className="text-charcoal/80 text-sm font-medium">
                            {new Intl.NumberFormat("he-IL", {
                              style: "currency",
                              currency: "ILS",
                              minimumFractionDigits: 0,
                            }).format(product.priceCents / 100)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  {products.length > 0 && (
                    <Link
                      href={`/products/${products[0]!.slug}` as never}
                      className="mt-6 inline-block"
                    >
                      <Button variant="secondary" size="sm">
                        {t("shopTheLook")}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
