import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("renders password toggle button for password type", () => {
    render(<Input label="Password" type="password" />);
    const toggle = screen.getByLabelText("Show password");
    expect(toggle).toBeInTheDocument();
  });

  it("toggles password visibility on click", async () => {
    const user = userEvent.setup();
    render(<Input label="Password" type="password" />);

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");

    await user.click(screen.getByLabelText("Show password"));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Hide password")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Hide password"));
    expect(input).toHaveAttribute("type", "password");
  });

  it("does not show password toggle for text type", () => {
    render(<Input label="Email" type="text" />);
    expect(screen.queryByLabelText("Show password")).not.toBeInTheDocument();
  });

  it("uses provided id over generated one", () => {
    render(<Input label="Email" id="custom-id" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "custom-id");
  });

  it("sets aria-describedby to hint when no error", () => {
    render(<Input label="Email" id="email" hint="Enter your email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-describedby", "email-hint");
  });

  it("sets aria-describedby to error when error present", () => {
    render(<Input label="Email" id="email" error="Required" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
  });

  it("does not set aria-describedby when no hint or error", () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).not.toHaveAttribute("aria-describedby");
  });
});
