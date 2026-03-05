import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./product-card";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "he",
}));

vi.mock("next/link", () => ({
  default: ({
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
}));

describe("ProductCard", () => {
  const defaultProps = {
    slug: "test-product",
    title: "Test Product",
    priceCents: 9900,
  };

  it("renders title", () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("links to correct product page", () => {
    render(<ProductCard {...defaultProps} />);
    const link = screen.getByRole("link", { name: /Test Product/i });
    expect(link).toHaveAttribute("href", "/products/test-product");
  });

  it("shows new badge when isNew", () => {
    render(<ProductCard {...defaultProps} isNew />);
    expect(screen.getByText("new")).toBeInTheDocument();
  });

  it("shows sale badge when comparePriceCents > priceCents", () => {
    render(
      <ProductCard {...defaultProps} priceCents={5000} comparePriceCents={8000} />,
    );
    expect(screen.getByText("sale")).toBeInTheDocument();
  });

  it("shows outOfStock badge when stockQty=0", () => {
    render(<ProductCard {...defaultProps} stockQty={0} />);
    expect(screen.getByText("outOfStock")).toBeInTheDocument();
  });

  it("renders image with alt text", () => {
    render(
      <ProductCard {...defaultProps} imageUrl="/test.jpg" imageAlt="Custom alt" />,
    );
    const img = screen.getByRole("img", { name: "Custom alt" });
    expect(img).toHaveAttribute("src", "/test.jpg");
  });

  it("shows fallback when no imageUrl", () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText("Tichel & Co.")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<ProductCard {...defaultProps} priceCents={9900} />);
    // formatPrice(9900) with ILS/he-IL yields "₪99.00" or similar
    expect(screen.getByText(/99/)).toBeInTheDocument();
  });
});
