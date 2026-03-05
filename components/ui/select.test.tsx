import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "@/components/ui/select";

describe("Select", () => {
  it("renders select element", () => {
    render(<Select options={[{ value: "a", label: "A" }]} />);
    const select = document.querySelector("select");
    expect(select).toBeInTheDocument();
  });

  it("renders options from options prop", () => {
    const options = [
      { value: "opt1", label: "Option 1" },
      { value: "opt2", label: "Option 2" },
    ];
    render(<Select options={options} />);
    expect(screen.getByRole("option", { name: "Option 1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 2" })).toBeInTheDocument();
  });

  it("renders children when no options", () => {
    render(
      <Select>
        <option value="child">Child Option</option>
      </Select>,
    );
    expect(screen.getByRole("option", { name: "Child Option" })).toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(<Select options={[{ value: "a", label: "A" }]} placeholder="Choose..." />);
    expect(screen.getByRole("option", { name: "Choose..." })).toBeInTheDocument();
  });

  it("renders error with role=alert", () => {
    render(<Select options={[{ value: "a", label: "A" }]} error="Required field" />);
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Required field");
  });

  it("renders label", () => {
    render(<Select label="Country" options={[{ value: "il", label: "Israel" }]} />);
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });
});
