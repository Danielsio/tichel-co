import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RangeSlider } from "./range-slider";

describe("RangeSlider", () => {
  it("renders two slider buttons with role=slider", () => {
    render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={vi.fn()} />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
  });

  it("displays min/max labels", () => {
    render(
      <RangeSlider
        min={0}
        max={100}
        value={[20, 80]}
        onChange={vi.fn()}
        formatLabel={(v) => `${v}%`}
      />,
    );
    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("sets correct aria values on sliders", () => {
    render(<RangeSlider min={0} max={100} value={[25, 75]} onChange={vi.fn()} />);
    const sliders = screen.getAllByRole("slider");
    const minSlider = sliders[0];
    const maxSlider = sliders[1];

    expect(minSlider).toHaveAttribute("aria-valuemin", "0");
    expect(minSlider).toHaveAttribute("aria-valuemax", "74"); // value[1] - step = 75 - 1
    expect(minSlider).toHaveAttribute("aria-valuenow", "25");

    expect(maxSlider).toHaveAttribute("aria-valuemin", "26");
    expect(maxSlider).toHaveAttribute("aria-valuemax", "100");
    expect(maxSlider).toHaveAttribute("aria-valuenow", "75");
  });

  it("arrow key navigation calls onChange with correct values", () => {
    const onChange = vi.fn();
    render(
      <RangeSlider min={0} max={100} value={[50, 80]} onChange={onChange} step={10} />,
    );
    const sliders = screen.getAllByRole("slider");

    // Focus min slider and press ArrowRight
    sliders[0]!.focus();
    fireEvent.keyDown(sliders[0]!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith([60, 80]);

    // Focus max slider and press ArrowLeft (value still [50, 80] from initial render)
    sliders[1]!.focus();
    fireEvent.keyDown(sliders[1]!, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith([50, 70]);
  });

  it("ArrowDown decreases min slider value", () => {
    const onChange = vi.fn();
    render(
      <RangeSlider min={0} max={100} value={[50, 80]} onChange={onChange} step={5} />,
    );
    const sliders = screen.getAllByRole("slider");
    sliders[0]!.focus();
    fireEvent.keyDown(sliders[0]!, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith([45, 80]);
  });

  it("ArrowUp increases max slider value", () => {
    const onChange = vi.fn();
    render(
      <RangeSlider min={0} max={100} value={[50, 80]} onChange={onChange} step={5} />,
    );
    const sliders = screen.getAllByRole("slider");
    sliders[1]!.focus();
    fireEvent.keyDown(sliders[1]!, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith([50, 85]);
  });

  it("clamps min slider to not go below min", () => {
    const onChange = vi.fn();
    render(
      <RangeSlider min={0} max={100} value={[0, 50]} onChange={onChange} step={10} />,
    );
    const sliders = screen.getAllByRole("slider");
    sliders[0]!.focus();
    fireEvent.keyDown(sliders[0]!, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith([0, 50]);
  });

  it("clamps max slider to not go above max", () => {
    const onChange = vi.fn();
    render(
      <RangeSlider min={0} max={100} value={[50, 100]} onChange={onChange} step={10} />,
    );
    const sliders = screen.getAllByRole("slider");
    sliders[1]!.focus();
    fireEvent.keyDown(sliders[1]!, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith([50, 100]);
  });

  it("renders with custom minLabel and maxLabel", () => {
    render(
      <RangeSlider
        min={0}
        max={100}
        value={[20, 80]}
        onChange={vi.fn()}
        minLabel="Low"
        maxLabel="High"
      />,
    );
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("ignores non-arrow keys", () => {
    const onChange = vi.fn();
    render(<RangeSlider min={0} max={100} value={[50, 80]} onChange={onChange} />);
    const sliders = screen.getAllByRole("slider");
    sliders[0]!.focus();
    fireEvent.keyDown(sliders[0]!, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });
});
