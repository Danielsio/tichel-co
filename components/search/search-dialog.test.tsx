import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { SearchDialog } from "./search-dialog";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const mockOpenSearch = vi.fn();
const mockCloseSearch = vi.fn();
let isSearchOpen = true;

vi.mock("@/stores/ui-store", () => ({
  useUIStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      isSearchOpen,
      openSearch: mockOpenSearch,
      closeSearch: mockCloseSearch,
    }),
}));

const mockProducts = [
  {
    id: "p1",
    slug: "silk-tichel",
    title: "Silk Tichel",
    priceCents: 15000,
    comparePriceCents: 20000,
    imageUrl: "/silk.jpg",
  },
  {
    id: "p2",
    slug: "cotton-tichel",
    title: "Cotton Tichel",
    priceCents: 10000,
    comparePriceCents: undefined,
    imageUrl: null,
  },
];

describe("SearchDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isSearchOpen = true;

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: mockProducts }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = "";
  });

  it("renders nothing when search is closed", () => {
    isSearchOpen = false;
    const { container } = render(<SearchDialog />);
    expect(container.innerHTML).toBe("");
  });

  it("renders the dialog when search is open", async () => {
    render(<SearchDialog />);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("locks body scroll when open", async () => {
    render(<SearchDialog />);
    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("fetches products on open", async () => {
    render(<SearchDialog />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/search");
    });
  });

  it("displays products after fetch", async () => {
    render(<SearchDialog />);
    await waitFor(() => {
      expect(screen.getByText("Silk Tichel")).toBeInTheDocument();
      expect(screen.getByText("Cotton Tichel")).toBeInTheDocument();
    });
  });

  it("shows compare price when present", async () => {
    render(<SearchDialog />);
    await waitFor(() => {
      expect(screen.getByText("Silk Tichel")).toBeInTheDocument();
    });
    const strikethroughPrices = document.querySelectorAll(".line-through");
    expect(strikethroughPrices.length).toBeGreaterThan(0);
  });

  it("shows placeholder image for products without imageUrl", async () => {
    render(<SearchDialog />);
    await waitFor(() => {
      expect(screen.getByText("T&C")).toBeInTheDocument();
    });
  });

  it("filters products by search query", async () => {
    render(<SearchDialog />);

    await waitFor(() => {
      expect(screen.getByText("Silk Tichel")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("placeholder");
    fireEvent.change(input, { target: { value: "silk" } });

    expect(screen.getByText("Silk Tichel")).toBeInTheDocument();
    expect(screen.queryByText("Cotton Tichel")).not.toBeInTheDocument();
  });

  it("shows noResults message when query matches nothing", async () => {
    render(<SearchDialog />);

    await waitFor(() => {
      expect(screen.getByText("Silk Tichel")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("placeholder");
    fireEvent.change(input, { target: { value: "nonexistent" } });

    expect(screen.getByText("noResults")).toBeInTheDocument();
  });

  it("shows startTyping message when no query and no products", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    }) as unknown as typeof fetch;

    render(<SearchDialog />);
    await waitFor(() => {
      expect(screen.getByText("startTyping")).toBeInTheDocument();
    });
  });

  it("calls closeSearch and resets query when overlay is clicked", async () => {
    render(<SearchDialog />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const overlay = document.querySelector(".fixed.inset-0.backdrop-blur-\\[2px\\]");
    if (overlay) fireEvent.click(overlay);

    expect(mockCloseSearch).toHaveBeenCalled();
  });

  it("closes on Escape key", async () => {
    render(<SearchDialog />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockCloseSearch).toHaveBeenCalled();
  });

  it("toggles search on Ctrl+K", async () => {
    render(<SearchDialog />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(mockCloseSearch).toHaveBeenCalled();
  });

  it("opens search on Ctrl+K when closed", async () => {
    isSearchOpen = false;
    render(<SearchDialog />);

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(mockOpenSearch).toHaveBeenCalled();
  });

  it("opens search on Meta+K (Mac)", async () => {
    isSearchOpen = false;
    render(<SearchDialog />);

    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(mockOpenSearch).toHaveBeenCalled();
  });

  it("closes search on clicking a product link", async () => {
    render(<SearchDialog />);

    await waitFor(() => {
      expect(screen.getByText("Silk Tichel")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Silk Tichel"));
    expect(mockCloseSearch).toHaveBeenCalled();
  });

  it("handles fetch failure gracefully", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValue(new Error("Network error")) as unknown as typeof fetch;

    render(<SearchDialog />);

    await waitFor(() => {
      expect(screen.getByText("startTyping")).toBeInTheDocument();
    });
  });

  it("shows loading skeleton while fetching", async () => {
    let resolvePromise: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    global.fetch = vi.fn().mockReturnValue(fetchPromise) as unknown as typeof fetch;

    render(<SearchDialog />);

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);

    await act(async () => {
      resolvePromise!({
        json: () => Promise.resolve({ data: mockProducts }),
      });
    });
  });

  it("restores body overflow on unmount", async () => {
    const { unmount } = render(<SearchDialog />);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
    });

    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
