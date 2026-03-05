import { describe, it, expect, vi } from "vitest";

const mockFetchCollection = vi.fn();
const mockFetchDoc = vi.fn();

vi.mock("./firestore", () => ({
  fetchCollection: (...args: unknown[]) => mockFetchCollection(...args),
  fetchDoc: (...args: unknown[]) => mockFetchDoc(...args),
  where: vi.fn((...args: unknown[]) => ({ type: "where", args })),
  orderBy: vi.fn((...args: unknown[]) => ({ type: "orderBy", args })),
}));

describe("lib/firebase/queries", () => {
  it("getPublishedCollections calls fetchCollection", async () => {
    mockFetchCollection.mockResolvedValue([]);
    const { getPublishedCollections } = await import("./queries");
    const result = await getPublishedCollections();
    expect(mockFetchCollection).toHaveBeenCalledWith(
      "collections",
      expect.anything(),
      expect.anything(),
    );
    expect(result).toEqual([]);
  });

  it("getCollectionBySlug returns first result", async () => {
    mockFetchCollection.mockResolvedValue([{ id: "c1", slug: "sig" }]);
    const { getCollectionBySlug } = await import("./queries");
    const result = await getCollectionBySlug("sig");
    expect(result).toEqual({ id: "c1", slug: "sig" });
  });

  it("getCollectionBySlug returns null when empty", async () => {
    mockFetchCollection.mockResolvedValue([]);
    const { getCollectionBySlug } = await import("./queries");
    const result = await getCollectionBySlug("none");
    expect(result).toBeNull();
  });

  it("getFeaturedProducts calls fetchCollection", async () => {
    mockFetchCollection.mockResolvedValue([]);
    const { getFeaturedProducts } = await import("./queries");
    const result = await getFeaturedProducts();
    expect(mockFetchCollection).toHaveBeenCalledWith(
      "products",
      expect.anything(),
      expect.anything(),
    );
    expect(result).toEqual([]);
  });

  it("getProductsByCollection calls fetchCollection", async () => {
    mockFetchCollection.mockResolvedValue([]);
    const { getProductsByCollection } = await import("./queries");
    const result = await getProductsByCollection("col-1");
    expect(result).toEqual([]);
  });

  it("getProductBySlug returns first result", async () => {
    mockFetchCollection.mockResolvedValue([{ id: "p1", slug: "silk" }]);
    const { getProductBySlug } = await import("./queries");
    const result = await getProductBySlug("silk");
    expect(result).toEqual({ id: "p1", slug: "silk" });
  });

  it("getProductBySlug returns null when empty", async () => {
    mockFetchCollection.mockResolvedValue([]);
    const { getProductBySlug } = await import("./queries");
    const result = await getProductBySlug("none");
    expect(result).toBeNull();
  });

  it("getProductVariants calls fetchCollection", async () => {
    mockFetchCollection.mockResolvedValue([]);
    const { getProductVariants } = await import("./queries");
    const result = await getProductVariants("p1");
    expect(mockFetchCollection).toHaveBeenCalledWith("products/p1/variants");
    expect(result).toEqual([]);
  });

  it("getProductById calls fetchDoc", async () => {
    mockFetchDoc.mockResolvedValue({ id: "p1", title: "Test" });
    const { getProductById } = await import("./queries");
    const result = await getProductById("p1");
    expect(mockFetchDoc).toHaveBeenCalledWith("products", "p1");
    expect(result).toEqual({ id: "p1", title: "Test" });
  });
});
