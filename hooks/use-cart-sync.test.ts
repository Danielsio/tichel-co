import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { onSnapshot } from "firebase/firestore";
import { useCartSync } from "./use-cart-sync";

type SnapshotCb = (snap: {
  exists: () => boolean;
  data: () => Record<string, unknown> | null;
}) => void;

let mockSnapshotCallback: SnapshotCb | null = null;
const mockUnsubscribe = vi.fn();
const mockSetDoc = vi.fn().mockResolvedValue(undefined);

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => "mock-cart-ref"),
  onSnapshot: vi.fn((_ref: unknown, cb: SnapshotCb) => {
    mockSnapshotCallback = cb;
    return mockUnsubscribe;
  }),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  serverTimestamp: () => "server-ts",
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

const mockAddItem = vi.fn();
const mockItems = [
  { variantId: "v1", productId: "p1", name: "Test", price: 100, quantity: 1 },
];

vi.mock("@/stores/cart-store", () => ({
  useCartStore: Object.assign(
    (selector: (s: Record<string, unknown>) => unknown) =>
      selector({
        items: mockItems,
        addItem: mockAddItem,
      }),
    {
      getState: () => ({ items: mockItems }),
    },
  ),
}));

let mockUser: { uid: string } | null = null;

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ user: mockUser }),
}));

describe("useCartSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockUser = null;
    mockSnapshotCallback = null;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not subscribe to Firestore when user is null", () => {
    renderHook(() => useCartSync());
    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it("subscribes to Firestore when user is logged in", () => {
    mockUser = { uid: "user-1" };
    renderHook(() => useCartSync());
    expect(onSnapshot).toHaveBeenCalled();
  });

  it("unsubscribes on unmount", () => {
    mockUser = { uid: "user-1" };
    const { unmount } = renderHook(() => useCartSync());
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("merges remote items that do not exist locally", () => {
    mockUser = { uid: "user-1" };
    renderHook(() => useCartSync());

    mockSnapshotCallback?.({
      exists: () => true,
      data: () => ({
        items: [
          { variantId: "v2", productId: "p2", name: "Remote", price: 200, quantity: 1 },
        ],
      }),
    });

    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ variantId: "v2" }),
    );
  });

  it("does not merge remote items that already exist locally", () => {
    mockUser = { uid: "user-1" };
    renderHook(() => useCartSync());

    mockSnapshotCallback?.({
      exists: () => true,
      data: () => ({
        items: [
          { variantId: "v1", productId: "p1", name: "Test", price: 100, quantity: 1 },
        ],
      }),
    });

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it("handles snapshot that does not exist", () => {
    mockUser = { uid: "user-1" };
    renderHook(() => useCartSync());

    mockSnapshotCallback?.({
      exists: () => false,
      data: () => null,
    });

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it("resets sync state when user logs out", () => {
    mockUser = { uid: "user-1" };
    const { rerender } = renderHook(() => useCartSync());

    mockSnapshotCallback?.({
      exists: () => false,
      data: () => null,
    });

    mockUser = null;
    rerender();
  });
});
