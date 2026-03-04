"use client";

import { useState, useRef, useCallback, useEffect, type PointerEvent } from "react";
import { cn } from "@/lib/utils/cn";

export interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatLabel?: (value: number) => string;
  minLabel?: string;
  maxLabel?: string;
  className?: string;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  formatLabel = (v) => String(v),
  minLabel,
  maxLabel,
  className,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  const range = max - min || 1;
  const minPercent = ((value[0] - min) / range) * 100;
  const maxPercent = ((value[1] - min) / range) * 100;

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return min;

      const rect = track.getBoundingClientRect();
      const isRtl = getComputedStyle(track).direction === "rtl";
      const ratio = isRtl
        ? (rect.right - clientX) / rect.width
        : (clientX - rect.left) / rect.width;

      const raw = min + ratio * range;
      const stepped = Math.round(raw / step) * step;
      return clamp(stepped, min, max);
    },
    [min, max, range, step],
  );

  const handlePointerDown = useCallback(
    (thumb: "min" | "max") => (e: PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setActiveThumb(thumb);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!activeThumb) return;
      const newVal = getValueFromPosition(e.clientX);

      if (activeThumb === "min") {
        onChange([Math.min(newVal, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(newVal, value[0] + step)]);
      }
    },
    [activeThumb, getValueFromPosition, onChange, value, step],
  );

  const handlePointerUp = useCallback(() => {
    setActiveThumb(null);
  }, []);

  useEffect(() => {
    if (!activeThumb) return;
    const handleGlobalUp = () => setActiveThumb(null);
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  }, [activeThumb]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="text-charcoal/60 flex items-center justify-between text-xs">
        <span>{minLabel ?? formatLabel(value[0])}</span>
        <span>{maxLabel ?? formatLabel(value[1])}</span>
      </div>

      <div
        ref={trackRef}
        className="relative h-6 touch-none select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="bg-stone absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full" />

        <div
          className="bg-gold absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
          style={{
            insetInlineStart: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        <button
          type="button"
          role="slider"
          aria-label={minLabel ?? formatLabel(value[0])}
          aria-valuemin={min}
          aria-valuemax={value[1] - step}
          aria-valuenow={value[0]}
          aria-valuetext={formatLabel(value[0])}
          className={cn(
            "border-gold absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-grab rounded-full border-2 bg-white shadow-sm transition-shadow",
            "focus-visible:ring-gold/40 hover:shadow-md focus-visible:ring-2",
            activeThumb === "min" && "scale-110 cursor-grabbing",
          )}
          style={{ insetInlineStart: `${minPercent}%`, marginInlineStart: "-10px" }}
          onPointerDown={handlePointerDown("min")}
        />

        <button
          type="button"
          role="slider"
          aria-label={maxLabel ?? formatLabel(value[1])}
          aria-valuemin={value[0] + step}
          aria-valuemax={max}
          aria-valuenow={value[1]}
          aria-valuetext={formatLabel(value[1])}
          className={cn(
            "border-gold absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-grab rounded-full border-2 bg-white shadow-sm transition-shadow",
            "focus-visible:ring-gold/40 hover:shadow-md focus-visible:ring-2",
            activeThumb === "max" && "scale-110 cursor-grabbing",
          )}
          style={{ insetInlineStart: `${maxPercent}%`, marginInlineStart: "-10px" }}
          onPointerDown={handlePointerDown("max")}
        />
      </div>
    </div>
  );
}
