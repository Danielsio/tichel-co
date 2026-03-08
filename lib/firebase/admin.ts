import { existsSync, readFileSync } from "fs";
import { generateKeyPairSync } from "crypto";
import { join } from "path";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let _app: App | undefined;
let _db: Firestore | undefined;
let _auth: Auth | undefined;

function getEmulatorCredential() {
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
  });
  return cert({
    projectId: "demo-tichel-co",
    clientEmail: "demo@demo-tichel-co.iam.gserviceaccount.com",
    privateKey,
  });
}

function getCredential() {
  const saPath = join(process.cwd(), "service-account.json");
  if (existsSync(saPath)) {
    return cert(JSON.parse(readFileSync(saPath, "utf-8")));
  }

  return cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  });
}

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0]!;
    return _app;
  }

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    _app = initializeApp({ credential: getEmulatorCredential() });
    return _app;
  }

  _app = initializeApp({ credential: getCredential() });
  return _app;
}

const FIRESTORE_DB_ID = process.env.FIRESTORE_DATABASE_ID ?? "tichel-co-db-eu";

export function getAdminDb(): Firestore {
  if (!_db) {
    const db = getFirestore(getAdminApp(), FIRESTORE_DB_ID);
    db.settings({ preferRest: true });
    _db = db;
  }
  return _db;
}

export function getAdminAuth(): Auth {
  if (!_auth) _auth = getAuth(getAdminApp());
  return _auth;
}
