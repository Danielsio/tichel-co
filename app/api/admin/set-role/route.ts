import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const { uid, role } = await req.json();

    if (!uid || !role) {
      return NextResponse.json({ error: "uid and role are required" }, { status: 400 });
    }

    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const secret = req.headers.get("x-admin-secret");
    if (secret !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["admin", "user"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Allowed: ${allowedRoles.join(", ")}` },
        { status: 400 },
      );
    }

    const auth = getAdminAuth();
    await auth.setCustomUserClaims(uid, { role });

    return NextResponse.json({ success: true, uid, role });
  } catch (error) {
    console.error("Set role error:", error);
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }
}
