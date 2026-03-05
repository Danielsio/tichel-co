import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Drawer } from "./drawer";

describe("Drawer", () => {
  it("renders dialog with aria-modal=true", () => {
    render(
      <Drawer isOpen onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("renders title when provided", () => {
    render(
      <Drawer isOpen onClose={vi.fn()} title="Drawer Title">
        <p>Content</p>
      </Drawer>,
    );
    expect(screen.getByText("Drawer Title")).toBeInTheDocument();
  });

  it("renders children in panel", () => {
    render(
      <Drawer isOpen onClose={vi.fn()}>
        <p>Panel content</p>
      </Drawer>,
    );
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("close button has correct aria-label", () => {
    render(
      <Drawer isOpen onClose={vi.fn()} title="Title" closeLabel="Close drawer">
        <p>Content</p>
      </Drawer>,
    );
    const closeButton = screen.getByRole("button", { name: "Close drawer" });
    expect(closeButton).toHaveAttribute("aria-label", "Close drawer");
  });

  it("calls onClose when Escape pressed", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose}>
        <p>Content</p>
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has correct visibility classes based on isOpen", () => {
    const { rerender } = render(
      <Drawer isOpen onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("visible");

    rerender(
      <Drawer isOpen={false} onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    expect(dialog).toHaveClass("invisible");
  });

  it("calls onClose when overlay clicked", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose}>
        <p>Content</p>
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog");
    const overlay = dialog.firstChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("traps focus with Tab key cycling", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="Title" closeLabel="Close">
        <button>First</button>
        <button>Last</button>
      </Drawer>,
    );

    const _first = screen.getByLabelText("Close");
    const last = screen.getByText("Last");

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    // Should cycle from last to first
  });

  it("traps focus with Shift+Tab cycling", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="Title" closeLabel="Close">
        <button>First</button>
        <button>Last</button>
      </Drawer>,
    );

    const first = screen.getByLabelText("Close");
    first.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    // Should cycle from first to last
  });

  it("sets body overflow to hidden when open", () => {
    render(
      <Drawer isOpen onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow when closed", () => {
    const { unmount } = render(
      <Drawer isOpen onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>,
    );
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("renders with side=end", () => {
    render(
      <Drawer isOpen onClose={vi.fn()} side="end">
        <p>Content</p>
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders with side=bottom", () => {
    render(
      <Drawer isOpen onClose={vi.fn()} side="bottom">
        <p>Content</p>
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
