import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCartSync } from "./use-cart-sync";

const mockOnSnapshot = vi.fn();
const mockSetDoc = vi.fn();
const mockDoc = vi.fn(() => "mock-cart-ref");

vi.mock("firebase/firestore", () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
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

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ user: null }),
}));

describe("useCartSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not subscribe to Firestore when user is null", () => {
    renderHook(() => useCartSync());
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });
});
