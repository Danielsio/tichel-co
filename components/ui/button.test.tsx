import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    const { container, rerender } = render(<Button variant="primary">Primary</Button>);
    let btn = container.querySelector("button");
    expect(btn).toHaveClass("bg-navy", "text-ivory");

    rerender(<Button variant="secondary">Secondary</Button>);
    btn = container.querySelector("button");
    expect(btn).toHaveClass("bg-transparent", "text-navy");

    rerender(<Button variant="ghost">Ghost</Button>);
    btn = container.querySelector("button");
    expect(btn).toHaveClass("bg-transparent");

    rerender(<Button variant="destructive">Destructive</Button>);
    btn = container.querySelector("button");
    expect(btn).toHaveClass("text-error");

    rerender(<Button variant="link">Link</Button>);
    btn = container.querySelector("button");
    expect(btn).toHaveClass("underline-offset-4");
  });

  it("shows loading spinner when isLoading", () => {
    render(<Button isLoading>Loading</Button>);
    const btn = screen.getByRole("button");
    const svg = btn.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-spin");
    expect(btn).toHaveTextContent("Loading");
  });

  it("is disabled when isLoading or disabled", () => {
    const { rerender } = render(<Button isLoading>Load</Button>);
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies fullWidth class", () => {
    const { container } = render(<Button fullWidth>Full</Button>);
    const btn = container.querySelector("button");
    expect(btn).toHaveClass("w-full");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
});
