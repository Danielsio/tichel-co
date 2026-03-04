import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const { uid, role } = await req.json();

    if (!uid || !role) {
      return NextResponse.json({ error: "uid and role are required" }, { status: 400 });
    }

    const secret = req.headers.get("x-admin-secret");
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = getAdminAuth();
    await auth.setCustomUserClaims(uid, { role });

    return NextResponse.json({ success: true, uid, role });
  } catch (error) {
    console.error("Set role error:", error);
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }
}
