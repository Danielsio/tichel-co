import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartDrawer } from "./cart-drawer";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/hooks/use-mounted", () => ({
  useMounted: () => true,
}));

const mockCloseCart = vi.fn();
const mockRemoveItem = vi.fn();
const mockUpdateQuantity = vi.fn();

interface MockCartItem {
  variantId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
}

interface MockStore {
  items: MockCartItem[];
  isOpen: boolean;
  closeCart: ReturnType<typeof vi.fn>;
  totalPrice: () => number;
  addItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
  updateQuantity: ReturnType<typeof vi.fn>;
  openCart: ReturnType<typeof vi.fn>;
  totalItems: () => number;
  toggleCart: ReturnType<typeof vi.fn>;
}

const emptyStore: MockStore = {
  items: [],
  isOpen: true,
  closeCart: mockCloseCart,
  totalPrice: () => 0,
  addItem: vi.fn(),
  removeItem: mockRemoveItem,
  updateQuantity: mockUpdateQuantity,
  openCart: vi.fn(),
  totalItems: () => 0,
  toggleCart: vi.fn(),
};

const storeWithItems: MockStore = {
  ...emptyStore,
  items: [
    {
      variantId: "v1",
      productId: "p1",
      name: "Silk Tichel",
      price: 15000,
      quantity: 2,
      image: "/img.jpg",
      color: "Blue",
      size: "M",
    },
  ],
  totalPrice: () => 30000,
};

let currentStore: MockStore = emptyStore;

vi.mock("@/stores/cart-store", () => ({
  useCartStore: (selector?: (s: Record<string, unknown>) => unknown) => {
    if (typeof selector === "function")
      return selector(currentStore as unknown as Record<string, unknown>);
    return currentStore;
  },
}));

vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({
    children,
    title,
    isOpen,
  }: {
    children: React.ReactNode;
    title: string;
    isOpen: boolean;
  }) =>
    isOpen ? (
      <div data-testid="drawer" aria-label={title}>
        {children}
      </div>
    ) : null,
}));

describe("CartDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentStore = emptyStore;
  });

  it("renders empty state when no items", () => {
    render(<CartDrawer />);
    expect(screen.getByText("empty")).toBeInTheDocument();
    expect(screen.getByText("continueShopping")).toBeInTheDocument();
  });

  it("renders cart items when items exist", () => {
    currentStore = storeWithItems;
    render(<CartDrawer />);
    expect(screen.getByText("Silk Tichel")).toBeInTheDocument();
    expect(screen.getByText("Blue / M")).toBeInTheDocument();
  });

  it("shows total price", () => {
    currentStore = storeWithItems;
    render(<CartDrawer />);
    expect(screen.getByText("total")).toBeInTheDocument();
  });

  it("renders checkout link", () => {
    currentStore = storeWithItems;
    render(<CartDrawer />);
    expect(screen.getByText("checkout")).toBeInTheDocument();
  });

  it("renders remove button for items", () => {
    currentStore = storeWithItems;
    render(<CartDrawer />);
    expect(screen.getByLabelText("removeItem")).toBeInTheDocument();
  });

  it("renders quantity controls", () => {
    currentStore = storeWithItems;
    render(<CartDrawer />);
    expect(screen.getByLabelText("decrease")).toBeInTheDocument();
    expect(screen.getByLabelText("increase")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
