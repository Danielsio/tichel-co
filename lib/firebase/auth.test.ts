import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSignInWithEmailAndPassword = vi.fn();
const mockCreateUserWithEmailAndPassword = vi.fn();
const mockSignOut = vi.fn();
const mockSignInWithPopup = vi.fn();
const mockOnAuthStateChanged = vi.fn();

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args: unknown[]) =>
    mockSignInWithEmailAndPassword(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    mockCreateUserWithEmailAndPassword(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
  getAuth: () => "mock-auth",
  connectAuthEmulator: vi.fn(),
}));

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
  getApps: () => [{}],
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: () => "mock-db",
  connectFirestoreEmulator: vi.fn(),
}));

vi.mock("firebase/storage", () => ({
  getStorage: () => "mock-storage",
  connectStorageEmulator: vi.fn(),
}));

describe("firebase/auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signIn calls signInWithEmailAndPassword", async () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({ user: {} });
    const { signIn } = await import("./auth");
    await signIn("test@test.com", "password");
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      "mock-auth",
      "test@test.com",
      "password",
    );
  });

  it("signUp calls createUserWithEmailAndPassword", async () => {
    mockCreateUserWithEmailAndPassword.mockResolvedValue({ user: {} });
    const { signUp } = await import("./auth");
    await signUp("test@test.com", "password");
    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      "mock-auth",
      "test@test.com",
      "password",
    );
  });

  it("signOut calls firebaseSignOut", async () => {
    mockSignOut.mockResolvedValue(undefined);
    const { signOut } = await import("./auth");
    await signOut();
    expect(mockSignOut).toHaveBeenCalledWith("mock-auth");
  });

  it("signInWithGoogle calls signInWithPopup", async () => {
    mockSignInWithPopup.mockResolvedValue({ user: {} });
    const { signInWithGoogle } = await import("./auth");
    await signInWithGoogle();
    expect(mockSignInWithPopup).toHaveBeenCalled();
  });

  it("onAuth calls onAuthStateChanged with callback", async () => {
    const callback = vi.fn();
    const unsubscribe = vi.fn();
    mockOnAuthStateChanged.mockReturnValue(unsubscribe);
    const { onAuth } = await import("./auth");
    const result = onAuth(callback);
    expect(mockOnAuthStateChanged).toHaveBeenCalledWith("mock-auth", callback);
    expect(result).toBe(unsubscribe);
  });
});
