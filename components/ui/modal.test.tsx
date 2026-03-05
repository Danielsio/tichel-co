import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "./modal";

describe("Modal", () => {
  it("returns null when isOpen=false", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders children when isOpen=true", () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Test Title">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("calls onClose when Escape pressed", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("close button has correct aria-label", () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Title" closeLabel="Close dialog">
        <p>Content</p>
      </Modal>,
    );
    const closeButton = screen.getByRole("button", { name: "Close dialog" });
    expect(closeButton).toHaveAttribute("aria-label", "Close dialog");
  });

  it("renders with role=dialog and aria-modal=true", () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("calls onClose when overlay clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    const backdrop = dialog.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
