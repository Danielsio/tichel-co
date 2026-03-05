import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "./breadcrumb";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "he",
}));

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
}));

describe("Breadcrumb", () => {
  it("renders all items", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Current" },
    ];
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("last item has aria-current=page", () => {
    const items = [{ label: "Home", href: "/" }, { label: "Current" }];
    render(<Breadcrumb items={items} />);
    const currentSpan = screen.getByText("Current");
    expect(currentSpan).toHaveAttribute("aria-current", "page");
  });

  it("items with href render as links", () => {
    // Last item renders as span; only non-last items with href render as Link
    const items = [{ label: "Home", href: "/" }, { label: "Current" }];
    render(<Breadcrumb items={items} />);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("items without href render as spans", () => {
    const items = [{ label: "Current" }];
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Current").tagName).toBe("SPAN");
  });

  it("renders nav with aria-label", () => {
    render(<Breadcrumb items={[{ label: "Home" }]} />);
    const nav = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(nav).toBeInTheDocument();
  });
});
