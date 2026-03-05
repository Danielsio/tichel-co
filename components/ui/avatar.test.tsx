import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("renders img when src provided", () => {
    render(<Avatar src="/avatar.jpg" alt="User" fallback="John Doe" />);
    const img = screen.getByRole("img", { name: "User" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/avatar.jpg");
  });

  it("renders initials when no src", () => {
    render(<Avatar fallback="John Doe" />);
    const span = screen.getByLabelText("John Doe");
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent("JD");
  });

  it("generates correct initials from multi-word fallback", () => {
    render(<Avatar fallback="Jane Marie Smith" />);
    const span = screen.getByLabelText("Jane Marie Smith");
    expect(span).toHaveTextContent("JM");
  });

  it("applies size classes", () => {
    const { container, rerender } = render(<Avatar fallback="Test" size="sm" />);
    let span = container.querySelector("span");
    expect(span).toHaveClass("h-8", "w-8", "text-xs");

    rerender(<Avatar fallback="Test" size="md" />);
    span = container.querySelector("span");
    expect(span).toHaveClass("h-10", "w-10", "text-sm");

    rerender(<Avatar fallback="Test" size="lg" />);
    span = container.querySelector("span");
    expect(span).toHaveClass("h-14", "w-14", "text-base");
  });
});
