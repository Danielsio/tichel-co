import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = performance.now();
  const checks: Record<string, { ok: boolean; ms: number; error?: string }> = {};

  try {
    const dbStart = performance.now();
    const db = getAdminDb();
    const snap = await db.collection("collections").limit(1).get();
    checks.firestore = {
      ok: !snap.empty,
      ms: Math.round(performance.now() - dbStart),
    };
    if (snap.empty) {
      checks.firestore.error = "No documents found — database may be empty";
    }
  } catch (err) {
    checks.firestore = {
      ok: false,
      ms: Math.round(performance.now() - start),
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }

  const allHealthy = Object.values(checks).every((c) => c.ok);
  const totalMs = Math.round(performance.now() - start);

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "unhealthy",
      totalMs,
      checks,
      region: process.env.FIRESTORE_DATABASE_ID ?? "tichel-co-db-eu",
      timestamp: new Date().toISOString(),
    },
    {
      status: allHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Server-Timing": `total;dur=${totalMs}, firestore;dur=${checks.firestore?.ms ?? 0}`,
      },
    },
  );
}
