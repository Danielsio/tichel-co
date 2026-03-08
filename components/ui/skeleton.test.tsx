import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton, ProductCardSkeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("renders with aria-hidden=true", () => {
    const { container } = render(<Skeleton />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveAttribute("aria-hidden", "true");
  });

  it("applies circular variant styles", () => {
    const { container } = render(<Skeleton variant="circular" />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("rounded-full");
  });

  it("applies text variant styles", () => {
    const { container } = render(<Skeleton variant="text" />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("h-4", "rounded-md");
  });

  it("applies rectangular variant styles", () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("rounded-xl");
  });
});

describe("ProductCardSkeleton", () => {
  it("renders multiple skeleton elements", () => {
    const { container } = render(<ProductCardSkeleton />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });
});
