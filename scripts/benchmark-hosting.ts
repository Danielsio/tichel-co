/* eslint-disable no-console */

/**
 * Hosting Performance Benchmark
 *
 * Compares response times between Vercel and Firebase App Hosting
 * across key pages. Run with: pnpm benchmark
 *
 * Usage:
 *   pnpm benchmark
 *   pnpm benchmark --runs 10
 *   pnpm benchmark --save
 */

const VERCEL_URL = "https://tichel-co.vercel.app";
const FIREBASE_URL = ""; // Fill in after Firebase App Hosting deploy

const PAGES = [
  { name: "Home (he)", path: "/" },
  { name: "Home (en)", path: "/en" },
  { name: "Product page", path: "/products/ivory-silk-square-tichel" },
  { name: "Collection page", path: "/collections/silk-dreams" },
  { name: "About", path: "/about" },
];

const DEFAULT_RUNS = 5;

interface TimingResult {
  url: string;
  status: number;
  ttfb: number;
  total: number;
  sizeKB: number;
}

interface PageResult {
  page: string;
  path: string;
  vercel: TimingResult | null;
  firebase: TimingResult | null;
}

async function measureRequest(baseUrl: string, path: string): Promise<TimingResult> {
  const url = `${baseUrl}${path}`;
  const start = performance.now();
  let ttfbMark = 0;

  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "TichelBenchmark/1.0" },
  });

  ttfbMark = performance.now();
  const body = await res.text();
  const end = performance.now();

  return {
    url,
    status: res.status,
    ttfb: Math.round(ttfbMark - start),
    total: Math.round(end - start),
    sizeKB: parseFloat((Buffer.byteLength(body) / 1024).toFixed(1)),
  };
}

async function benchmarkPage(
  page: { name: string; path: string },
  runs: number,
): Promise<PageResult> {
  const vercelResults: TimingResult[] = [];
  const firebaseResults: TimingResult[] = [];

  for (let i = 0; i < runs; i++) {
    try {
      vercelResults.push(await measureRequest(VERCEL_URL, page.path));
    } catch {
      /* skip failed request */
    }

    if (FIREBASE_URL) {
      try {
        firebaseResults.push(await measureRequest(FIREBASE_URL, page.path));
      } catch {
        /* skip failed request */
      }
    }

    if (i < runs - 1) await sleep(500);
  }

  return {
    page: page.name,
    path: page.path,
    vercel: average(vercelResults),
    firebase: FIREBASE_URL ? average(firebaseResults) : null,
  };
}

function average(results: TimingResult[]): TimingResult | null {
  if (results.length === 0) return null;
  return {
    url: results[0]!.url,
    status: results[0]!.status,
    ttfb: Math.round(results.reduce((s, r) => s + r.ttfb, 0) / results.length),
    total: Math.round(results.reduce((s, r) => s + r.total, 0) / results.length),
    sizeKB: results[0]!.sizeKB,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printResults(results: PageResult[], runs: number) {
  const divider = "═".repeat(60);

  console.log(`\n${divider}`);
  console.log(`  Hosting Performance Comparison`);
  console.log(`  ${new Date().toISOString()}`);
  console.log(`  Runs per page: ${runs}`);
  console.log(`${divider}\n`);

  for (const r of results) {
    console.log(`  Page: ${r.page} (${r.path})`);
    console.log(`  ${"─".repeat(50)}`);

    if (r.vercel) {
      console.log(
        `  Vercel:   TTFB ${String(r.vercel.ttfb).padStart(5)}ms | ` +
          `Total ${String(r.vercel.total).padStart(5)}ms | ` +
          `${r.vercel.sizeKB} KB | ${r.vercel.status}`,
      );
    } else {
      console.log(`  Vercel:   (failed)`);
    }

    if (r.firebase) {
      console.log(
        `  Firebase: TTFB ${String(r.firebase.ttfb).padStart(5)}ms | ` +
          `Total ${String(r.firebase.total).padStart(5)}ms | ` +
          `${r.firebase.sizeKB} KB | ${r.firebase.status}`,
      );
    } else if (FIREBASE_URL) {
      console.log(`  Firebase: (failed)`);
    } else {
      console.log(`  Firebase: (URL not configured — update FIREBASE_URL in script)`);
    }

    if (r.vercel && r.firebase) {
      const diff = r.firebase.ttfb - r.vercel.ttfb;
      const winner = diff > 0 ? "Vercel" : diff < 0 ? "Firebase" : "Tie";
      const absDiff = Math.abs(diff);
      console.log(`  Winner:   ${winner}${absDiff > 0 ? ` (+${absDiff}ms TTFB)` : ""}`);
    }

    console.log();
  }

  if (results.some((r) => r.vercel && r.firebase)) {
    const avgVercel =
      results.filter((r) => r.vercel).reduce((s, r) => s + r.vercel!.ttfb, 0) /
      results.filter((r) => r.vercel).length;
    const avgFirebase =
      results.filter((r) => r.firebase).reduce((s, r) => s + r.firebase!.ttfb, 0) /
      results.filter((r) => r.firebase).length;

    console.log(`  ${"═".repeat(50)}`);
    console.log(
      `  Average TTFB — Vercel: ${Math.round(avgVercel)}ms | Firebase: ${Math.round(avgFirebase)}ms`,
    );
    console.log(
      `  Overall winner: ${avgVercel < avgFirebase ? "Vercel" : "Firebase"} by ${Math.abs(Math.round(avgVercel - avgFirebase))}ms`,
    );
    console.log();
  }
}

async function saveResults(results: PageResult[], runs: number) {
  const { mkdirSync, writeFileSync } = await import("fs");
  const dir = "benchmarks";
  mkdirSync(dir, { recursive: true });
  const filename = `${dir}/benchmark-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  writeFileSync(
    filename,
    JSON.stringify({ date: new Date().toISOString(), runs, results }, null, 2),
  );
  console.log(`  Results saved to ${filename}\n`);
}

async function main() {
  const args = process.argv.slice(2);
  const runs = args.includes("--runs")
    ? parseInt(args[args.indexOf("--runs") + 1]!, 10) || DEFAULT_RUNS
    : DEFAULT_RUNS;
  const shouldSave = args.includes("--save");

  if (!FIREBASE_URL) {
    console.log("\n  ⚠ FIREBASE_URL is empty — only benchmarking Vercel.");
    console.log(
      "  Update FIREBASE_URL in scripts/benchmark-hosting.ts once Firebase App Hosting is live.\n",
    );
  }

  console.log(`\n  Benchmarking ${PAGES.length} pages × ${runs} runs...`);

  const results: PageResult[] = [];
  for (const page of PAGES) {
    process.stdout.write(`  Testing: ${page.name}...`);
    const result = await benchmarkPage(page, runs);
    results.push(result);
    console.log(" done");
  }

  printResults(results, runs);

  if (shouldSave) {
    await saveResults(results, runs);
  }
}

main().catch(console.error);
