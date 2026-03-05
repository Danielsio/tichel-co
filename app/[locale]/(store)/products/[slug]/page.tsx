import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/mock-data";
import { ProductPageClient } from "./product-client";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = product.title[locale as "he" | "en"];
  const description = product.description[locale as "he" | "en"];

  return {
    title,
    description,
    alternates: {
      languages: {
        he: `/products/${slug}`,
        en: `/en/products/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: product.variants[0]?.imageUrls[0]
        ? [{ url: product.variants[0].imageUrls[0] }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
