import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders input element", () => {
    render(<Input />);
    const input = document.querySelector("input");
    expect(input).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders error message with role=alert", () => {
    render(<Input label="Email" error="Invalid email" />);
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Invalid email");
  });

  it("renders hint when no error", () => {
    render(<Input label="Email" hint="Enter your email" />);
    expect(screen.getByText("Enter your email")).toBeInTheDocument();
  });

  it("does not render hint when error is present", () => {
    render(<Input label="Email" hint="Hint" error="Error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Error");
    expect(screen.queryByText("Hint")).not.toBeInTheDocument();
  });

  it("sets aria-invalid when error", () => {
    render(<Input label="Email" error="Error" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("generates id from label", () => {
    render(<Input label="User Name" />);
    const input = screen.getByLabelText("User Name");
    expect(input).toHaveAttribute("id", "user-name");
  });
});
