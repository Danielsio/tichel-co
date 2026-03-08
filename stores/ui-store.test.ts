import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "./ui-store";

describe("UI store", () => {
  beforeEach(() => {
    useUIStore.setState({ isMobileMenuOpen: false, isSearchOpen: false });
  });

  it("starts with mobile menu closed", () => {
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("opens mobile menu", () => {
    useUIStore.getState().openMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
  });

  it("closes mobile menu", () => {
    useUIStore.getState().openMobileMenu();
    useUIStore.getState().closeMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("toggles mobile menu", () => {
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("starts with search closed", () => {
    expect(useUIStore.getState().isSearchOpen).toBe(false);
  });

  it("opens search", () => {
    useUIStore.getState().openSearch();
    expect(useUIStore.getState().isSearchOpen).toBe(true);
  });

  it("closes search", () => {
    useUIStore.getState().openSearch();
    useUIStore.getState().closeSearch();
    expect(useUIStore.getState().isSearchOpen).toBe(false);
  });
});
