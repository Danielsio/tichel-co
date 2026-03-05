import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCollectionBySlug,
  getProductsByCollection,
  getPublishedCollections,
} from "@/lib/firebase/admin-queries";
import { CollectionPageClient } from "./collection-client";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};

  const title = collection.title[locale as "he" | "en"];
  const description = collection.description[locale as "he" | "en"];

  return {
    title,
    description,
    alternates: {
      languages: {
        he: `/collections/${slug}`,
        en: `/en/collections/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: collection.imageUrl ? [{ url: collection.imageUrl }] : undefined,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const [products, allCollections] = await Promise.all([
    getProductsByCollection(collection.id),
    getPublishedCollections(),
  ]);

  return (
    <CollectionPageClient
      collection={collection}
      products={products}
      allCollections={allCollections}
    />
  );
}
