import { describe, it, expect, vi } from "vitest";

const mockGetDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockQuery = vi.fn((...args: unknown[]) => args);
const mockCollection = vi.fn((...args: unknown[]) => args.join("/"));
const mockDoc = vi.fn((...args: unknown[]) => args.join("/"));

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: (...args: unknown[]) => mockQuery(...args),
  where: vi.fn((...args: unknown[]) => ({ type: "where", args })),
  orderBy: vi.fn((...args: unknown[]) => ({ type: "orderBy", args })),
  limit: vi.fn(),
  serverTimestamp: vi.fn(),
  Timestamp: {},
  getFirestore: () => "mock-db",
  connectFirestoreEmulator: vi.fn(),
}));

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
  getApps: () => [{}],
}));

vi.mock("firebase/auth", () => ({
  getAuth: () => "mock-auth",
  connectAuthEmulator: vi.fn(),
}));

vi.mock("firebase/storage", () => ({
  getStorage: () => "mock-storage",
  connectStorageEmulator: vi.fn(),
}));

describe("lib/firebase/firestore", () => {
  it("fetchDoc returns data when document exists", async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      id: "doc-1",
      data: () => ({ title: "Test" }),
    });

    const { fetchDoc } = await import("./firestore");
    const result = await fetchDoc("products", "doc-1");
    expect(result).toEqual({ id: "doc-1", title: "Test" });
  });

  it("fetchDoc returns null when document does not exist", async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });

    const { fetchDoc } = await import("./firestore");
    const result = await fetchDoc("products", "missing");
    expect(result).toBeNull();
  });

  it("fetchCollection returns mapped documents", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: "d1", data: () => ({ title: "A" }) },
        { id: "d2", data: () => ({ title: "B" }) },
      ],
    });

    const { fetchCollection } = await import("./firestore");
    const result = await fetchCollection("products");
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: "d1", title: "A" });
  });

  it("getCollection returns a collection reference", async () => {
    const { getCollection } = await import("./firestore");
    getCollection("products");
    expect(mockCollection).toHaveBeenCalled();
  });

  it("getDocument returns a document reference", async () => {
    const { getDocument } = await import("./firestore");
    getDocument("products", "doc-1");
    expect(mockDoc).toHaveBeenCalled();
  });
});
