import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    const { container } = render(<Badge>Default</Badge>);
    const span = container.querySelector("span");
    expect(span).toHaveClass("bg-stone", "text-charcoal");
  });

  it("applies custom className", () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    const span = container.querySelector("span");
    expect(span).toHaveClass("custom-class");
  });

  it.each(["default", "new", "sale", "outOfStock", "success", "warning"] as const)(
    "renders %s variant",
    (variant) => {
      const { container } = render(<Badge variant={variant}>{variant}</Badge>);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(screen.getByText(variant)).toBeInTheDocument();
    },
  );
});
