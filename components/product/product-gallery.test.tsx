import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductGallery } from "./product-gallery";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
}));

const images = [
  { url: "https://example.com/a.jpg", altText: "Image A" },
  { url: "https://example.com/b.jpg", altText: "Image B" },
];

describe("ProductGallery", () => {
  it("renders fallback when no images", () => {
    render(<ProductGallery images={[]} />);
    expect(screen.getByText("Tichel & Co.")).toBeInTheDocument();
  });

  it("renders the first image as active", () => {
    render(<ProductGallery images={images} />);
    const mainImg = screen.getAllByRole("img")[0];
    expect(mainImg).toHaveAttribute("alt", "Image A");
  });

  it("renders thumbnails when multiple images", () => {
    render(<ProductGallery images={images} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("switches active image on thumbnail click", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} />);

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]!);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
  });

  it("does not render thumbnails for single image", () => {
    render(<ProductGallery images={[images[0]!]} />);
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("renders tablist container", () => {
    render(<ProductGallery images={images} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("navigates thumbnails with ArrowRight key", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} />);

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[0]!);
    await user.keyboard("{ArrowRight}");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("navigates thumbnails with ArrowLeft key", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} />);

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]!);
    await user.keyboard("{ArrowLeft}");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("clamps to first image on ArrowLeft at start", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} />);

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[0]!);
    await user.keyboard("{ArrowLeft}");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("clamps to last image on ArrowRight at end", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} />);

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]!);
    await user.keyboard("{ArrowRight}");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("uses alt text from image", () => {
    render(<ProductGallery images={images} />);
    const mainImg = screen.getAllByRole("img")[0];
    expect(mainImg).toHaveAttribute("alt", "Image A");
  });
});
