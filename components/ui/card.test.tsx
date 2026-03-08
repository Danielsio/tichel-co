import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders as article element", () => {
    const { container } = render(<Card>Content</Card>);
    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent("Content");
  });

  it("applies padding styles", () => {
    const { container, rerender } = render(<Card padding="none">None</Card>);
    let article = container.querySelector("article");
    expect(article).not.toHaveClass("p-4", "p-6", "p-8");

    rerender(<Card padding="sm">Small</Card>);
    article = container.querySelector("article");
    expect(article).toHaveClass("p-4");

    rerender(<Card padding="md">Medium</Card>);
    article = container.querySelector("article");
    expect(article).toHaveClass("p-6");

    rerender(<Card padding="lg">Large</Card>);
    article = container.querySelector("article");
    expect(article).toHaveClass("p-8");
  });

  it("applies hover styles", () => {
    const { container } = render(<Card hover>Hover</Card>);
    const article = container.querySelector("article");
    expect(article).toHaveClass("hover:shadow-[var(--shadow-card)]");
  });

  it("CardHeader, CardTitle, CardContent, CardFooter render children", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardTitle>Title</CardTitle>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
