/**
 * Promote a Firebase Auth user to admin by email.
 *
 * Usage:
 *   npx tsx scripts/set-admin.ts user@example.com
 *
 * Requires service-account.json in the project root.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const email = process.argv[2];
if (!email) {
  console.error("Usage: npx tsx scripts/set-admin.ts <email>");
  process.exit(1);
}

const saPath = join(process.cwd(), "service-account.json");
if (!existsSync(saPath)) {
  console.error("service-account.json not found in project root.");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(readFileSync(saPath, "utf-8"))),
  });
}

async function main() {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email!);
  await auth.setCustomUserClaims(user.uid, { role: "admin" });
  console.log(`✓ ${email} (uid: ${user.uid}) is now an admin.`);
  console.log("  The user must sign out and back in for the claim to take effect.");
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
