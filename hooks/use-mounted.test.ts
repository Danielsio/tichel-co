import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMounted } from "./use-mounted";

describe("useMounted", () => {
  it("returns false initially", () => {
    const values: boolean[] = [];
    renderHook(() => {
      const mounted = useMounted();
      values.push(mounted);
      return mounted;
    });
    expect(values[0]).toBe(false);
  });

  it("returns true after mount", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });
});
