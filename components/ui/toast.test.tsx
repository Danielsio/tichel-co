import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { ToastProvider, useToast } from "./toast";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

function TestConsumer() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast("Hello")}>show default</button>
      <button onClick={() => toast("OK", "success")}>show success</button>
      <button onClick={() => toast("Fail", "error")}>show error</button>
    </div>
  );
}

describe("ToastProvider + useToast", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when useToast is used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const Broken = () => {
      useToast();
      return null;
    };
    expect(() => render(<Broken />)).toThrow(
      "useToast must be used within ToastProvider",
    );
    spy.mockRestore();
  });

  it("shows a toast with default variant", () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("show default"));
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Hello");
  });

  it("shows a success toast", () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("show success"));
    });
    expect(screen.getByRole("alert")).toHaveTextContent("OK");
  });

  it("dismisses toast after clicking close button", () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("show default"));
    });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByLabelText("close"));
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("auto-dismisses toast after 4 seconds", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("show default"));
    });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4100);
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
