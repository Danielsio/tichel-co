import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToCartButton } from "./add-to-cart-button";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const mockAddItem = vi.fn();
const mockOpenCart = vi.fn();
const mockToast = vi.fn();

vi.mock("@/stores/cart-store", () => ({
  useCartStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ addItem: mockAddItem, openCart: mockOpenCart }),
}));

vi.mock("@/components/ui/toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const baseProps = {
  variantId: "v1",
  productId: "p1",
  name: "Test Product",
  price: 10000,
  image: "img.jpg",
  color: "Red",
  size: "M",
  stockQty: 5,
};

describe("AddToCartButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders add-to-bag text when in stock", () => {
    render(<AddToCartButton {...baseProps} />);
    expect(screen.getByRole("button")).toHaveTextContent("addToBag");
  });

  it("renders out-of-stock text when stockQty is 0", () => {
    render(<AddToCartButton {...baseProps} stockQty={0} />);
    expect(screen.getByRole("button")).toHaveTextContent("outOfStock");
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls addItem and openCart on click", async () => {
    const user = userEvent.setup();
    render(<AddToCartButton {...baseProps} />);

    await user.click(screen.getByRole("button"));
    expect(mockAddItem).toHaveBeenCalledWith({
      variantId: "v1",
      productId: "p1",
      name: "Test Product",
      price: 10000,
      quantity: 1,
      image: "img.jpg",
      color: "Red",
      size: "M",
    });
    expect(mockOpenCart).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalled();
  });

  it("does not call addItem when out of stock", async () => {
    const user = userEvent.setup();
    render(<AddToCartButton {...baseProps} stockQty={0} />);

    await user.click(screen.getByRole("button"));
    expect(mockAddItem).not.toHaveBeenCalled();
  });
});
