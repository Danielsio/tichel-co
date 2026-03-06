import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getCollectionById,
} from "@/lib/firebase/admin-queries";
import { ProductPageClient } from "./product-client";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = product.title;
  const description = product.description;

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
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const firstCollectionId = product.collectionIds[0];
  const [related, firstCollection] = await Promise.all([
    getRelatedProducts(product),
    firstCollectionId ? getCollectionById(firstCollectionId) : null,
  ]);

  const collectionTitle = firstCollection?.title;

  return (
    <ProductPageClient
      product={product}
      relatedProducts={related}
      collectionTitle={collectionTitle}
    />
  );
}
