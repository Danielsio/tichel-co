import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { GoogleIcon } from "./google";

describe("GoogleIcon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies custom className", () => {
    const { container } = render(<GoogleIcon className="h-6 w-6" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-6", "h-6");
  });

  it("renders all four Google brand color paths", () => {
    const { container } = render(<GoogleIcon />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(4);

    const fills = Array.from(paths).map((p) => p.getAttribute("fill"));
    expect(fills).toContain("#4285F4");
    expect(fills).toContain("#34A853");
    expect(fills).toContain("#FBBC05");
    expect(fills).toContain("#EA4335");
  });
});
