import { getAdminDb } from "./admin";
import type { StoreProduct, StoreVariant, StoreCollection } from "@/types";

function isAdminConfigured(): boolean {
  try {
    getAdminDb();
    return true;
  } catch {
    return false;
  }
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
  if (!isAdminConfigured()) return [];
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("collections")
      .where("publishedAt", "!=", null)
      .orderBy("displayOrder", "asc")
      .get();
    return snap.docs.map((d) => toStoreCollection(d.id, d.data()));
  } catch (e) {
    console.error("[admin-queries] getPublishedCollections failed:", e);
    return [];
  }
}

export async function getCollectionBySlug(
  slug: string,
): Promise<StoreCollection | null> {
  if (!isAdminConfigured()) return null;
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("collections")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0]!;
    return toStoreCollection(doc.id, doc.data());
  } catch (e) {
    console.error("[admin-queries] getCollectionBySlug failed:", e);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<StoreProduct[]> {
  if (!isAdminConfigured()) return [];
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("products")
      .where("publishedAt", "!=", null)
      .where("isFeatured", "==", true)
      .get();
    const products = await Promise.all(
      snap.docs.map(async (d) => {
        const variants = await fetchVariants(d.id);
        return toStoreProduct(d.id, d.data(), variants);
      }),
    );
    return products;
  } catch (e) {
    console.error("[admin-queries] getFeaturedProducts failed:", e);
    return [];
  }
}

export async function getProductsByCollection(
  collectionId: string,
): Promise<StoreProduct[]> {
  if (!isAdminConfigured()) return [];
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("products")
      .where("publishedAt", "!=", null)
      .where("collectionIds", "array-contains", collectionId)
      .get();
    const products = await Promise.all(
      snap.docs.map(async (d) => {
        const variants = await fetchVariants(d.id);
        return toStoreProduct(d.id, d.data(), variants);
      }),
    );
    return products;
  } catch (e) {
    console.error("[admin-queries] getProductsByCollection failed:", e);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  if (!isAdminConfigured()) return null;
  try {
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
  } catch (e) {
    console.error("[admin-queries] getProductBySlug failed:", e);
    return null;
  }
}

export async function getCollectionById(
  collectionId: string,
): Promise<StoreCollection | null> {
  if (!isAdminConfigured()) return null;
  try {
    const db = getAdminDb();
    const doc = await db.collection("collections").doc(collectionId).get();
    if (!doc.exists) return null;
    return toStoreCollection(doc.id, doc.data()!);
  } catch (e) {
    console.error("[admin-queries] getCollectionById failed:", e);
    return null;
  }
}

export async function getProductById(productId: string): Promise<StoreProduct | null> {
  if (!isAdminConfigured()) return null;
  try {
    const db = getAdminDb();
    const doc = await db.collection("products").doc(productId).get();
    if (!doc.exists) return null;
    const variants = await fetchVariants(doc.id);
    return toStoreProduct(doc.id, doc.data()!, variants);
  } catch (e) {
    console.error("[admin-queries] getProductById failed:", e);
    return null;
  }
}

export async function getPublishedProducts(): Promise<StoreProduct[]> {
  if (!isAdminConfigured()) return [];
  try {
    const db = getAdminDb();
    const snap = await db.collection("products").where("publishedAt", "!=", null).get();
    const products = await Promise.all(
      snap.docs.map(async (d) => {
        const variants = await fetchVariants(d.id);
        return toStoreProduct(d.id, d.data(), variants);
      }),
    );
    return products;
  } catch (e) {
    console.error("[admin-queries] getPublishedProducts failed:", e);
    return [];
  }
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
  if (!isAdminConfigured()) return null;
  try {
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
  } catch (e) {
    console.error("[admin-queries] lookupProductPrice failed:", e);
    return null;
  }
}
