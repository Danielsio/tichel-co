import { describe, it, expect, vi } from "vitest";

const mockRef = vi.fn((...args: unknown[]) => args.join("/"));
const mockUploadBytes = vi.fn();
const mockGetDownloadURL = vi.fn();
const mockDeleteObject = vi.fn();

vi.mock("firebase/storage", () => ({
  ref: (...args: unknown[]) => mockRef(...args),
  uploadBytes: (...args: unknown[]) => mockUploadBytes(...args),
  getDownloadURL: (...args: unknown[]) => mockGetDownloadURL(...args),
  deleteObject: (...args: unknown[]) => mockDeleteObject(...args),
  getStorage: () => "mock-storage",
  connectStorageEmulator: vi.fn(),
}));

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
  getApps: () => [{}],
}));

vi.mock("firebase/auth", () => ({
  getAuth: () => "mock-auth",
  connectAuthEmulator: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: () => "mock-db",
  connectFirestoreEmulator: vi.fn(),
}));

describe("lib/firebase/storage", () => {
  it("uploadFile uploads and returns download URL", async () => {
    mockUploadBytes.mockResolvedValue({ ref: "uploaded-ref" });
    mockGetDownloadURL.mockResolvedValue("https://example.com/file.jpg");

    const { uploadFile } = await import("./storage");
    const blob = new Blob(["test"]);
    const result = await uploadFile("images/test.jpg", blob);
    expect(result).toBe("https://example.com/file.jpg");
    expect(mockUploadBytes).toHaveBeenCalled();
  });

  it("deleteFile deletes the file", async () => {
    mockDeleteObject.mockResolvedValue(undefined);

    const { deleteFile } = await import("./storage");
    await deleteFile("images/test.jpg");
    expect(mockDeleteObject).toHaveBeenCalled();
  });

  it("getFileUrl returns download URL", async () => {
    mockGetDownloadURL.mockResolvedValue("https://example.com/file.jpg");

    const { getFileUrl } = await import("./storage");
    const result = await getFileUrl("images/test.jpg");
    expect(result).toBe("https://example.com/file.jpg");
  });
});
