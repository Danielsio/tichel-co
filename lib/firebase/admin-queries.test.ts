import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPublishedCollections,
  getCollectionBySlug,
  getCollectionById,
  getFeaturedProducts,
  getProductBySlug,
  getProductById,
  getProductsByCollection,
  getPublishedProducts,
  getRelatedProducts,
  lookupProductPrice,
} from "./admin-queries";

const mockGet = vi.fn();
const mockDoc = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();
const mockCollection = vi.fn();

function createMockDb() {
  const chain = {
    collection: mockCollection,
    doc: mockDoc,
    where: mockWhere,
    orderBy: mockOrderBy,
    limit: mockLimit,
    get: mockGet,
  };
  mockCollection.mockReturnValue(chain);
  mockDoc.mockReturnValue(chain);
  mockWhere.mockReturnValue(chain);
  mockOrderBy.mockReturnValue(chain);
  mockLimit.mockReturnValue(chain);
  return chain;
}

vi.mock("./admin", () => ({
  getAdminDb: () => createMockDb(),
}));

const collectionDoc = {
  id: "col-1",
  data: () => ({
    slug: "signature",
    title: "Signature Collection",
    description: "Desc",
    imageUrl: "img.jpg",
    displayOrder: 1,
    publishedAt: new Date(),
  }),
};

const productDoc = {
  id: "prod-1",
  data: () => ({
    slug: "silk-tichel",
    title: "Silk Tichel",
    description: "A nice tichel",
    priceCents: 15000,
    collectionIds: ["col-1"],
    isFeatured: true,
    isNew: false,
    publishedAt: new Date(),
  }),
};

describe("admin-queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPublishedCollections", () => {
    it("returns mapped collections", async () => {
      mockGet.mockResolvedValue({ docs: [collectionDoc] });

      const result = await getPublishedCollections();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: "col-1",
        slug: "signature",
        title: "Signature Collection",
        description: "Desc",
        imageUrl: "img.jpg",
        displayOrder: 1,
      });
    });

    it("returns empty array when no docs", async () => {
      mockGet.mockResolvedValue({ docs: [] });
      const result = await getPublishedCollections();
      expect(result).toEqual([]);
    });
  });

  describe("getCollectionBySlug", () => {
    it("returns collection when found", async () => {
      mockGet.mockResolvedValue({ empty: false, docs: [collectionDoc] });
      const result = await getCollectionBySlug("signature");
      expect(result).not.toBeNull();
      expect(result!.slug).toBe("signature");
    });

    it("returns null when not found", async () => {
      mockGet.mockResolvedValue({ empty: true, docs: [] });
      const result = await getCollectionBySlug("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("getCollectionById", () => {
    it("returns collection when found", async () => {
      mockGet.mockResolvedValue({
        exists: true,
        id: "col-1",
        data: collectionDoc.data,
      });
      const result = await getCollectionById("col-1");
      expect(result).not.toBeNull();
      expect(result!.id).toBe("col-1");
    });

    it("returns null when not found", async () => {
      mockGet.mockResolvedValue({ exists: false });
      const result = await getCollectionById("missing");
      expect(result).toBeNull();
    });
  });

  describe("getFeaturedProducts", () => {
    it("returns featured products with variants", async () => {
      mockGet.mockResolvedValueOnce({ docs: [productDoc] }).mockResolvedValueOnce({
        docs: [
          {
            id: "v1",
            data: () => ({
              sku: "SK-001",
              color: "Blue",
              fabric: "Silk",
              stockQty: 5,
              imageUrls: [],
            }),
          },
        ],
      });

      const result = await getFeaturedProducts();
      expect(result).toHaveLength(1);
      expect(result[0]!.variants).toHaveLength(1);
    });
  });

  describe("getProductBySlug", () => {
    it("returns product when found", async () => {
      mockGet
        .mockResolvedValueOnce({ empty: false, docs: [productDoc] })
        .mockResolvedValueOnce({ docs: [] });

      const result = await getProductBySlug("silk-tichel");
      expect(result).not.toBeNull();
      expect(result!.slug).toBe("silk-tichel");
    });

    it("returns null when not found", async () => {
      mockGet.mockResolvedValue({ empty: true, docs: [] });
      const result = await getProductBySlug("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("getProductById", () => {
    it("returns product when found", async () => {
      mockGet
        .mockResolvedValueOnce({ exists: true, id: "prod-1", data: productDoc.data })
        .mockResolvedValueOnce({ docs: [] });

      const result = await getProductById("prod-1");
      expect(result).not.toBeNull();
      expect(result!.id).toBe("prod-1");
    });

    it("returns null when not found", async () => {
      mockGet.mockResolvedValue({ exists: false });
      const result = await getProductById("missing");
      expect(result).toBeNull();
    });
  });

  describe("getProductsByCollection", () => {
    it("returns products in collection", async () => {
      mockGet
        .mockResolvedValueOnce({ docs: [productDoc] })
        .mockResolvedValueOnce({ docs: [] });

      const result = await getProductsByCollection("col-1");
      expect(result).toHaveLength(1);
    });
  });

  describe("getPublishedProducts", () => {
    it("returns all published products", async () => {
      mockGet
        .mockResolvedValueOnce({ docs: [productDoc] })
        .mockResolvedValueOnce({ docs: [] });

      const result = await getPublishedProducts();
      expect(result).toHaveLength(1);
    });
  });

  describe("getRelatedProducts", () => {
    it("returns related products excluding current", async () => {
      const otherProduct = {
        id: "prod-2",
        data: () => ({
          slug: "cotton-tichel",
          title: "Cotton Tichel",
          description: "Another tichel",
          priceCents: 10000,
          collectionIds: ["col-1"],
          isFeatured: false,
          isNew: true,
          publishedAt: new Date(),
        }),
      };

      mockGet
        .mockResolvedValueOnce({ docs: [productDoc, otherProduct] })
        .mockResolvedValue({ docs: [] });

      const current = {
        id: "prod-1",
        slug: "silk-tichel",
        title: "Silk Tichel",
        description: "A nice tichel",
        priceCents: 15000,
        collectionIds: ["col-1"],
        isFeatured: true,
        isNew: false,
        variants: [],
      };

      const result = await getRelatedProducts(current);
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("prod-2");
    });
  });

  describe("lookupProductPrice", () => {
    it("returns price when product and variant exist", async () => {
      mockGet
        .mockResolvedValueOnce({
          exists: true,
          data: () => ({ priceCents: 15000 }),
        })
        .mockResolvedValueOnce({ exists: true });

      const result = await lookupProductPrice("prod-1", "v1");
      expect(result).toBe(15000);
    });

    it("returns null when product not found", async () => {
      mockGet.mockResolvedValueOnce({ exists: false });
      const result = await lookupProductPrice("missing", "v1");
      expect(result).toBeNull();
    });

    it("returns null when variant not found", async () => {
      mockGet
        .mockResolvedValueOnce({
          exists: true,
          data: () => ({ priceCents: 15000 }),
        })
        .mockResolvedValueOnce({ exists: false });

      const result = await lookupProductPrice("prod-1", "missing");
      expect(result).toBeNull();
    });
  });
});
