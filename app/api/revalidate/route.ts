import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const ALLOWED_TAGS = ["products", "collections", "orders"];

export async function POST(req: NextRequest) {
  try {
    const { tag, secret } = await req.json();

    const revalidationSecret = process.env.REVALIDATION_SECRET;
    if (!revalidationSecret || secret !== revalidationSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!tag || typeof tag !== "string") {
      return NextResponse.json({ error: "Tag required" }, { status: 400 });
    }

    if (!ALLOWED_TAGS.includes(tag)) {
      return NextResponse.json(
        { error: `Invalid tag. Allowed: ${ALLOWED_TAGS.join(", ")}` },
        { status: 400 },
      );
    }

    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
