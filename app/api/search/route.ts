import { NextResponse } from "next/server";
import { getPublishedProducts } from "@/lib/firebase/admin-queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getPublishedProducts();

    const results = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      priceCents: p.priceCents,
      comparePriceCents: p.comparePriceCents,
      imageUrl: p.variants[0]?.imageUrls[0] ?? null,
    }));

    return NextResponse.json({ data: results, error: null });
  } catch {
    return NextResponse.json(
      {
        data: null,
        error: { message: "Failed to load products", code: "SEARCH_ERROR" },
      },
      { status: 500 },
    );
  }
}
