import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartSyncProvider } from "./cart-sync-provider";

vi.mock("@/hooks/use-cart-sync", () => ({
  useCartSync: vi.fn(),
}));

describe("CartSyncProvider", () => {
  it("renders children", () => {
    render(
      <CartSyncProvider>
        <div data-testid="child">Hello</div>
      </CartSyncProvider>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Hello");
  });
});
