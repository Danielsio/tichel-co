import { fetchCollection, fetchDoc, where, orderBy } from "./firestore";
import type { FirestoreProduct, FirestoreCollection, FirestoreVariant } from "@/types";

export async function getPublishedCollections() {
  return fetchCollection<FirestoreCollection>(
    "collections",
    where("publishedAt", "!=", null),
    orderBy("displayOrder", "asc"),
  );
}

export async function getCollectionBySlug(slug: string) {
  const results = await fetchCollection<FirestoreCollection>(
    "collections",
    where("slug.en", "==", slug),
  );
  return results[0] ?? null;
}

export async function getFeaturedProducts() {
  return fetchCollection<FirestoreProduct>(
    "products",
    where("publishedAt", "!=", null),
    where("isFeatured", "==", true),
  );
}

export async function getProductsByCollection(collectionId: string) {
  return fetchCollection<FirestoreProduct>(
    "products",
    where("publishedAt", "!=", null),
    where("collectionIds", "array-contains", collectionId),
  );
}

export async function getProductBySlug(slug: string) {
  const results = await fetchCollection<FirestoreProduct>(
    "products",
    where("slug.en", "==", slug),
  );
  return results[0] ?? null;
}

export async function getProductVariants(productId: string) {
  return fetchCollection<FirestoreVariant>(`products/${productId}/variants`);
}

export async function getProductById(productId: string) {
  return fetchDoc<FirestoreProduct>("products", productId);
}
