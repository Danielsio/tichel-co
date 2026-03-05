import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

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

describe("Footer", () => {
  it("renders the footer element", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders brand name Tichel & Co.", () => {
    render(<Footer />);
    expect(screen.getByText("Tichel & Co.")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    // tNav returns the key (e.g. "collections", "tichels")
    expect(screen.getByRole("link", { name: "collections" })).toHaveAttribute(
      "href",
      "/collections/signature-collection",
    );
    expect(screen.getByRole("link", { name: "tichels" })).toHaveAttribute(
      "href",
      "/collections/silk-dreams",
    );
  });

  it("renders copyright text", () => {
    render(<Footer />);
    // useTranslations("footer")("rights", { year }) returns "rights" with our mock
    expect(screen.getByText("rights")).toBeInTheDocument();
  });
});
