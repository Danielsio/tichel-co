import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

const mockOnTTFB = vi.fn();
const mockOnFCP = vi.fn();
const mockOnLCP = vi.fn();
const mockOnINP = vi.fn();
const mockOnCLS = vi.fn();

vi.mock("web-vitals", () => ({
  onTTFB: (cb: unknown) => mockOnTTFB(cb),
  onFCP: (cb: unknown) => mockOnFCP(cb),
  onLCP: (cb: unknown) => mockOnLCP(cb),
  onINP: (cb: unknown) => mockOnINP(cb),
  onCLS: (cb: unknown) => mockOnCLS(cb),
}));

import { WebVitalsReporter } from "./web-vitals-reporter";

describe("WebVitalsReporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    Object.defineProperty(window, "location", {
      value: { hostname: "test.vercel.app" },
      writable: true,
    });

    vi.stubGlobal(
      "performance",
      Object.assign(performance, {
        getEntriesByType: vi.fn().mockReturnValue([
          {
            domainLookupStart: 0,
            domainLookupEnd: 10,
            connectStart: 10,
            connectEnd: 30,
            secureConnectionStart: 15,
            requestStart: 30,
            responseStart: 80,
            responseEnd: 100,
            domContentLoadedEventEnd: 200,
            startTime: 0,
            loadEventEnd: 300,
            transferSize: 51200,
          },
        ]),
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders null (no visible DOM)", () => {
    const { container } = render(<WebVitalsReporter />);
    expect(container.innerHTML).toBe("");
  });

  it("subscribes to all five web vitals on mount", () => {
    render(<WebVitalsReporter />);
    expect(mockOnTTFB).toHaveBeenCalledOnce();
    expect(mockOnFCP).toHaveBeenCalledOnce();
    expect(mockOnLCP).toHaveBeenCalledOnce();
    expect(mockOnINP).toHaveBeenCalledOnce();
    expect(mockOnCLS).toHaveBeenCalledOnce();
  });

  it("logs metrics after debounce when vitals are reported", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WebVitalsReporter />);

    const collectCb = mockOnTTFB.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "TTFB", value: 150, rating: "good" });
    collectCb({ name: "FCP", value: 800, rating: "good" });

    vi.advanceTimersByTime(3500);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).toContain("Web Vitals");
    expect(loggedStr).toContain("TTFB");

    consoleSpy.mockRestore();
  });

  it("includes CLS formatted to 4 decimal places", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WebVitalsReporter />);

    const collectCb = mockOnCLS.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "CLS", value: 0.0523, rating: "good" });

    vi.advanceTimersByTime(3500);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).toContain("0.0523");

    consoleSpy.mockRestore();
  });

  it("includes navigation timing in the log", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WebVitalsReporter />);

    const collectCb = mockOnTTFB.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "TTFB", value: 80, rating: "good" });

    vi.advanceTimersByTime(3500);

    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).toContain("DNS:");
    expect(loggedStr).toContain("Server:");
    expect(loggedStr).toContain("Transfer:");

    consoleSpy.mockRestore();
  });

  it("handles Vercel host label", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WebVitalsReporter />);

    const collectCb = mockOnTTFB.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "TTFB", value: 50, rating: "good" });

    vi.advanceTimersByTime(3500);

    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).toContain("Vercel");

    consoleSpy.mockRestore();
  });

  it("handles Firebase host label", () => {
    Object.defineProperty(window, "location", {
      value: { hostname: "app.web.app" },
      writable: true,
    });

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<WebVitalsReporter />);

    const collectCb = mockOnTTFB.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "TTFB", value: 50, rating: "good" });

    vi.advanceTimersByTime(3500);

    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).toContain("Firebase");

    consoleSpy.mockRestore();
  });

  it("handles custom hostname fallback", () => {
    Object.defineProperty(window, "location", {
      value: { hostname: "custom.example.com" },
      writable: true,
    });

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<WebVitalsReporter />);

    const collectCb = mockOnTTFB.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "TTFB", value: 50, rating: "good" });

    vi.advanceTimersByTime(3500);

    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).toContain("custom.example.com");

    consoleSpy.mockRestore();
  });

  it("handles missing navigation timing", () => {
    vi.stubGlobal(
      "performance",
      Object.assign(performance, {
        getEntriesByType: vi.fn().mockReturnValue([]),
      }),
    );

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<WebVitalsReporter />);

    const collectCb = mockOnTTFB.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "TTFB", value: 50, rating: "good" });

    vi.advanceTimersByTime(3500);

    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).not.toContain("DNS:");

    consoleSpy.mockRestore();
  });

  it("debounces multiple quick metric reports", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WebVitalsReporter />);

    const collectCb = mockOnTTFB.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "TTFB", value: 50, rating: "good" });

    vi.advanceTimersByTime(1000);
    collectCb({ name: "FCP", value: 300, rating: "good" });

    vi.advanceTimersByTime(3500);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).toContain("TTFB");
    expect(loggedStr).toContain("FCP");

    consoleSpy.mockRestore();
  });

  it("formats sub-1ms values with 3 decimal places", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WebVitalsReporter />);

    const collectCb = mockOnTTFB.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "TTFB", value: 0.123, rating: "good" });

    vi.advanceTimersByTime(3500);

    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).toContain("0.123");

    consoleSpy.mockRestore();
  });

  it("handles no secureConnectionStart (TLS = 0)", () => {
    vi.stubGlobal(
      "performance",
      Object.assign(performance, {
        getEntriesByType: vi.fn().mockReturnValue([
          {
            domainLookupStart: 0,
            domainLookupEnd: 5,
            connectStart: 5,
            connectEnd: 15,
            secureConnectionStart: 0,
            requestStart: 15,
            responseStart: 50,
            responseEnd: 60,
            domContentLoadedEventEnd: 100,
            startTime: 0,
            loadEventEnd: 150,
            transferSize: 1024,
          },
        ]),
      }),
    );

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<WebVitalsReporter />);

    const collectCb = mockOnTTFB.mock.calls[0][0] as (m: unknown) => void;
    collectCb({ name: "TTFB", value: 50, rating: "good" });

    vi.advanceTimersByTime(3500);

    const loggedStr = consoleSpy.mock.calls[0]![0] as string;
    expect(loggedStr).toContain("TLS: 0ms");

    consoleSpy.mockRestore();
  });
});
