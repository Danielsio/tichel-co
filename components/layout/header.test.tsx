import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./header";

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

const mockOpenCart = vi.fn();
const mockOpenMobileMenu = vi.fn();
const mockCloseMobileMenu = vi.fn();
const mockOpenSearch = vi.fn();

vi.mock("@/stores/cart-store", () => ({
  useCartStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      totalItems: () => 3,
      openCart: mockOpenCart,
    }),
}));

vi.mock("@/stores/ui-store", () => ({
  useUIStore: (selector?: (s: Record<string, unknown>) => unknown) => {
    const state = {
      isMobileMenuOpen: false,
      openMobileMenu: mockOpenMobileMenu,
      closeMobileMenu: mockCloseMobileMenu,
      isSearchOpen: false,
      openSearch: mockOpenSearch,
      closeSearch: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
}));

vi.mock("@/hooks/use-mounted", () => ({
  useMounted: () => true,
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
      <div data-testid="drawer" role="dialog" aria-label={title}>
        {children}
      </div>
    ) : null,
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the brand name", () => {
    render(<Header />);
    expect(screen.getByText("Tichel & Co.")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByText("collections")).toBeInTheDocument();
    expect(screen.getByText("tichels")).toBeInTheDocument();
    expect(screen.getByText("scarves")).toBeInTheDocument();
  });

  it("shows cart count when items exist", () => {
    render(<Header />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("opens cart on cart button click", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByLabelText("cart"));
    expect(mockOpenCart).toHaveBeenCalled();
  });

  it("opens mobile menu on menu button click", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByLabelText("openMenu"));
    expect(mockOpenMobileMenu).toHaveBeenCalled();
  });

  it("renders the header element", () => {
    render(<Header />);
    expect(document.querySelector("header")).toBeInTheDocument();
  });

  it("renders account link", () => {
    render(<Header />);
    expect(screen.getByLabelText("account")).toHaveAttribute("href", "/account");
  });

  it("renders search button", () => {
    render(<Header />);
    expect(screen.getByLabelText("search")).toBeInTheDocument();
  });
});
