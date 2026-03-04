import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore, type CartItem } from "./cart-store";

const mockItem: CartItem = {
  variantId: "variant-1",
  productId: "product-1",
  name: "טישל משי כחול",
  price: 45000,
  quantity: 1,
  image: "https://example.com/image.jpg",
  color: "כחול",
  size: "M",
};

const mockItem2: CartItem = {
  variantId: "variant-2",
  productId: "product-2",
  name: "צעיף פשתן",
  price: 22000,
  quantity: 2,
  image: "https://example.com/image2.jpg",
  color: "ירוק",
  size: "L",
};

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
  });

  it("starts with empty cart", () => {
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.totalItems()).toBe(0);
    expect(state.totalPrice()).toBe(0);
  });

  it("adds item to cart", () => {
    useCartStore.getState().addItem(mockItem);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.name).toBe("טישל משי כחול");
  });

  it("increments quantity when adding same variant", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem(mockItem);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(2);
  });

  it("adds different variants as separate items", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem(mockItem2);
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("removes item from cart", () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem(mockItem);
    removeItem("variant-1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("updates item quantity", () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockItem);
    updateQuantity("variant-1", 5);
    expect(useCartStore.getState().items[0]?.quantity).toBe(5);
  });

  it("removes item when quantity set to 0", () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockItem);
    updateQuantity("variant-1", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calculates total items correctly", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem(mockItem2);
    expect(useCartStore.getState().totalItems()).toBe(3);
  });

  it("calculates total price correctly", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem(mockItem2);
    // 45000 * 1 + 22000 * 2 = 89000
    expect(useCartStore.getState().totalPrice()).toBe(89000);
  });

  it("clears cart", () => {
    const { addItem, clearCart } = useCartStore.getState();
    addItem(mockItem);
    addItem(mockItem2);
    clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("opens and closes cart drawer", () => {
    const { openCart, closeCart } = useCartStore.getState();
    expect(useCartStore.getState().isOpen).toBe(false);
    openCart();
    expect(useCartStore.getState().isOpen).toBe(true);
    closeCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it("toggles cart drawer", () => {
    const { toggleCart } = useCartStore.getState();
    toggleCart();
    expect(useCartStore.getState().isOpen).toBe(true);
    toggleCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
