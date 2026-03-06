import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { User } from "firebase/auth";
import { useAuth } from "./use-auth";
import { onAuth } from "@/lib/firebase/auth";

vi.mock("@/lib/firebase/auth", () => ({
  onAuth: vi.fn(),
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.mocked(onAuth).mockReset();
  });

  it("starts with loading=true, user=null, isAuthenticated=false", () => {
    vi.mocked(onAuth).mockImplementation((_callback) => {
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("sets user and loading=false when callback fires with a user", async () => {
    const mockUser = {
      getIdTokenResult: vi.fn().mockResolvedValue({ claims: { role: "user" } }),
    } as unknown;

    let authCallback: ((u: User | null) => void) | undefined;
    vi.mocked(onAuth).mockImplementation((callback) => {
      authCallback = callback;
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      authCallback?.(mockUser as User);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("sets isAdmin=true when user has admin role claim", async () => {
    const mockUser = {
      getIdTokenResult: vi.fn().mockResolvedValue({ claims: { role: "admin" } }),
    } as unknown;

    let authCallback: ((u: User | null) => void) | undefined;
    vi.mocked(onAuth).mockImplementation((callback) => {
      authCallback = callback;
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      authCallback?.(mockUser as User);
    });

    expect(result.current.isAdmin).toBe(true);
  });

  it("sets isAdmin=false when user is null", async () => {
    let authCallback: ((u: User | null) => void) | undefined;
    vi.mocked(onAuth).mockImplementation((callback) => {
      authCallback = callback;
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      authCallback?.(null);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it("returns unsubscribe function", () => {
    const unsubscribe = vi.fn();
    vi.mocked(onAuth).mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
