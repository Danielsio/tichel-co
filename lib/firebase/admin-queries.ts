import { getAdminDb } from "./admin";
import type { StoreProduct, StoreVariant, StoreCollection } from "@/types";

async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const ms = (performance.now() - start).toFixed(1);
  console.log(`[perf] ${label}: ${ms}ms`);
  return result;
}

async function fetchVariants(productId: string): Promise<StoreVariant[]> {
  const db = getAdminDb();
  const snap = await db
    .collection("products")
    .doc(productId)
    .collection("variants")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StoreVariant);
}

function toStoreProduct(
  id: string,
  data: FirebaseFirestore.DocumentData,
  variants: StoreVariant[],
): StoreProduct {
  return {
    id,
    slug: data.slug ?? id,
    title: data.title ?? "",
    description: data.description ?? "",
    priceCents: data.priceCents,
    comparePriceCents: data.comparePriceCents ?? undefined,
    collectionIds: data.collectionIds ?? [],
    isFeatured: data.isFeatured ?? false,
    isNew: data.isNew ?? false,
    variants,
  };
}

function toStoreCollection(
  id: string,
  data: FirebaseFirestore.DocumentData,
): StoreCollection {
  return {
    id,
    slug: data.slug ?? id,
    title: data.title ?? "",
    description: data.description ?? "",
    imageUrl: data.imageUrl,
    displayOrder: data.displayOrder ?? 0,
  };
}

export async function getPublishedCollections(): Promise<StoreCollection[]> {
  return timed("getPublishedCollections", async () => {
    const db = getAdminDb();
    const snap = await db
      .collection("collections")
      .where("publishedAt", "!=", null)
      .orderBy("displayOrder", "asc")
      .get();
    return snap.docs.map((d) => toStoreCollection(d.id, d.data()));
  });
}

export async function getCollectionBySlug(
  slug: string,
): Promise<StoreCollection | null> {
  const db = getAdminDb();
  const snap = await db
    .collection("collections")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return toStoreCollection(doc.id, doc.data());
}

export async function getFeaturedProducts(): Promise<StoreProduct[]> {
  return timed("getFeaturedProducts", async () => {
    const db = getAdminDb();
    const snap = await db
      .collection("products")
      .where("publishedAt", "!=", null)
      .where("isFeatured", "==", true)
      .get();
    return Promise.all(
      snap.docs.map(async (d) => {
        const variants = await fetchVariants(d.id);
        return toStoreProduct(d.id, d.data(), variants);
      }),
    );
  });
}

export async function getProductsByCollection(
  collectionId: string,
): Promise<StoreProduct[]> {
  return timed(`getProductsByCollection(${collectionId})`, async () => {
    const db = getAdminDb();
    const snap = await db
      .collection("products")
      .where("publishedAt", "!=", null)
      .where("collectionIds", "array-contains", collectionId)
      .get();
    return Promise.all(
      snap.docs.map(async (d) => {
        const variants = await fetchVariants(d.id);
        return toStoreProduct(d.id, d.data(), variants);
      }),
    );
  });
}

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  return timed(`getProductBySlug(${slug})`, async () => {
    const db = getAdminDb();
    const snap = await db
      .collection("products")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0]!;
    const variants = await fetchVariants(doc.id);
    return toStoreProduct(doc.id, doc.data(), variants);
  });
}

export async function getCollectionById(
  collectionId: string,
): Promise<StoreCollection | null> {
  const db = getAdminDb();
  const doc = await db.collection("collections").doc(collectionId).get();
  if (!doc.exists) return null;
  return toStoreCollection(doc.id, doc.data()!);
}

export async function getProductById(productId: string): Promise<StoreProduct | null> {
  const db = getAdminDb();
  const doc = await db.collection("products").doc(productId).get();
  if (!doc.exists) return null;
  const variants = await fetchVariants(doc.id);
  return toStoreProduct(doc.id, doc.data()!, variants);
}

export async function getPublishedProducts(): Promise<StoreProduct[]> {
  return timed("getPublishedProducts", async () => {
    const db = getAdminDb();
    const snap = await db.collection("products").where("publishedAt", "!=", null).get();
    return Promise.all(
      snap.docs.map(async (d) => {
        const variants = await fetchVariants(d.id);
        return toStoreProduct(d.id, d.data(), variants);
      }),
    );
  });
}

export async function getRelatedProducts(
  product: StoreProduct,
  limit = 4,
): Promise<StoreProduct[]> {
  const all = await getPublishedProducts();
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        p.collectionIds.some((c) => product.collectionIds.includes(c)),
    )
    .slice(0, limit);
}

export async function lookupProductPrice(
  productId: string,
  variantId: string,
): Promise<number | null> {
  const db = getAdminDb();
  const productDoc = await db.collection("products").doc(productId).get();
  if (!productDoc.exists) return null;
  const variantDoc = await db
    .collection("products")
    .doc(productId)
    .collection("variants")
    .doc(variantId)
    .get();
  if (!variantDoc.exists) return null;
  return productDoc.data()!.priceCents;
}
