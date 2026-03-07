"use client";

import { useEffect, useRef } from "react";
import { onTTFB, onFCP, onLCP, onINP, onCLS, type Metric } from "web-vitals";

function getHostLabel(): string {
  if (typeof window === "undefined") return "unknown";
  const host = window.location.hostname;
  if (host.includes("vercel")) return `Vercel (${host})`;
  if (host.includes("hosted.app") || host.includes("web.app"))
    return `Firebase (${host})`;
  return host;
}

function getNavigationTiming() {
  if (typeof window === "undefined") return null;
  const [nav] = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];
  if (!nav) return null;

  return {
    dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
    tcp: Math.round(nav.connectEnd - nav.connectStart),
    tls: Math.round(
      nav.secureConnectionStart > 0 ? nav.connectEnd - nav.secureConnectionStart : 0,
    ),
    server: Math.round(nav.responseStart - nav.requestStart),
    download: Math.round(nav.responseEnd - nav.responseStart),
    domReady: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
    fullLoad: Math.round(nav.loadEventEnd - nav.startTime),
    transferSize: nav.transferSize,
  };
}

function formatMs(value: number): string {
  return value < 1 ? value.toFixed(3) : `${Math.round(value)}ms`;
}

export function WebVitalsReporter() {
  const metricsRef = useRef<Map<string, Metric>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const collect = (metric: Metric) => {
      metricsRef.current.set(metric.name, metric);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const host = getHostLabel();
        const nav = getNavigationTiming();
        const m = metricsRef.current;

        const lines = [`%c[Web Vitals] ${host}`, "color: #6366f1; font-weight: bold"];

        const vitals = [
          ["TTFB", m.get("TTFB")],
          ["FCP", m.get("FCP")],
          ["LCP", m.get("LCP")],
          ["INP", m.get("INP")],
          ["CLS", m.get("CLS")],
        ] as const;

        for (const [name, metric] of vitals) {
          if (metric) {
            const val =
              name === "CLS" ? metric.value.toFixed(4) : formatMs(metric.value);
            const rating = metric.rating ?? "";
            lines[0] += `\n  ${name.padEnd(5)} ${String(val).padStart(8)}  ${rating}`;
          }
        }

        if (nav) {
          lines[0] +=
            `\n  ─────────────────────────` +
            `\n  DNS: ${nav.dns}ms | TCP: ${nav.tcp}ms | TLS: ${nav.tls}ms` +
            `\n  Server: ${nav.server}ms | Download: ${nav.download}ms` +
            `\n  DOM Ready: ${nav.domReady}ms | Full Load: ${nav.fullLoad}ms` +
            `\n  Transfer: ${(nav.transferSize / 1024).toFixed(1)} KB`;
        }

        console.log(...lines);
      }, 3000);
    };

    onTTFB(collect);
    onFCP(collect);
    onLCP(collect);
    onINP(collect);
    onCLS(collect);
  }, []);

  return null;
}
