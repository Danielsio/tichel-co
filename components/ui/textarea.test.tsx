import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  it("renders textarea element", () => {
    render(<Textarea />);
    const textarea = document.querySelector("textarea");
    expect(textarea).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<Textarea label="Message" />);
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("renders error", () => {
    render(<Textarea label="Message" error="Too short" />);
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Too short");
  });

  it("renders hint", () => {
    render(<Textarea label="Message" hint="Max 500 characters" />);
    expect(screen.getByText("Max 500 characters")).toBeInTheDocument();
  });

  it("sets aria-invalid when error", () => {
    render(<Textarea label="Message" error="Error" />);
    const textarea = screen.getByLabelText("Message");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });
});
