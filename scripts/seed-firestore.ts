/**
 * Seed script — populates Firestore with product and collection data.
 *
 * Usage:
 *   npx tsx scripts/seed-firestore.ts
 *
 * By default seeds the emulator. Set SEED_PRODUCTION=true to seed production
 * (requires service-account.json or FIREBASE_ADMIN_* env vars).
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp, type Firestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "fs";
import { generateKeyPairSync } from "crypto";
import { join } from "path";

const EMULATOR_HOST = "127.0.0.1:8080";

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

const DB_ID = process.env.FIRESTORE_DATABASE_ID ?? "tichel-co-db-eu";

function init(): Firestore {
  const useEmulator = process.env.SEED_PRODUCTION !== "true";

  if (useEmulator) {
    process.env.FIRESTORE_EMULATOR_HOST = EMULATOR_HOST;
    console.warn(`→ Targeting Firestore emulator at ${EMULATOR_HOST}`);
  } else {
    console.warn("→ Targeting PRODUCTION Firestore");
  }

  console.warn(`→ Database ID: ${DB_ID}`);

  if (!getApps().length) {
    if (useEmulator) {
      initializeApp({ credential: getEmulatorCredential() });
    } else {
      const saPath = join(process.cwd(), "service-account.json");
      if (existsSync(saPath)) {
        initializeApp({
          credential: cert(JSON.parse(readFileSync(saPath, "utf-8"))),
        });
      } else {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        });
      }
    }
  }

  const app = getApps()[0]!;
  const db = getFirestore(app, DB_ID);
  db.settings({ preferRest: true });
  return db;
}

const now = Timestamp.now();

const collections = [
  {
    id: "signature-collection",
    slug: "signature-collection",
    title: "הקולקציה החתימתית",
    description: "הפריטים המובחרים שלנו — עיצובים קלאסיים מבדים יוקרתיים",
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    displayOrder: 1,
    publishedAt: now,
  },
  {
    id: "silk-dreams",
    slug: "silk-dreams",
    title: "חלומות משי",
    description: "טישלים ממשי טהור — רכות, אלגנטיות ונוחות לאורך כל היום",
    imageUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    displayOrder: 2,
    publishedAt: now,
  },
  {
    id: "everyday-elegance",
    slug: "everyday-elegance",
    title: "אלגנטיות יומיומית",
    description: "צעיפים נוחים ומעוצבים ליומיום — כי כל יום ראוי ליופי",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    displayOrder: 3,
    publishedAt: now,
  },
  {
    id: "bridal",
    slug: "bridal",
    title: "קולקציית כלות",
    description: "כיסויי ראש לכלות — עיצובים מרהיבים ליום המיוחד",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    displayOrder: 4,
    publishedAt: now,
  },
  {
    id: "accessories",
    slug: "accessories",
    title: "אביזרים",
    description: "סיכות, קשתות ופרטים קטנים שמשלימים את המראה",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    displayOrder: 5,
    publishedAt: now,
  },
];

interface VariantSeed {
  id: string;
  sku: string;
  color: string;
  fabric: string;
  stockQty: number;
  imageUrls: string[];
}

interface ProductSeed {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  comparePriceCents?: number;
  collectionIds: string[];
  skuBase: string;
  isFeatured: boolean;
  isNew: boolean;
  publishedAt: Timestamp;
  createdAt: Timestamp;
  variants: VariantSeed[];
}

const products: ProductSeed[] = [
  {
    id: "prod-001",
    slug: "ivory-silk-square-tichel",
    title: "טישל משי מרובע — שנהב",
    description:
      "טישל מרובע ממשי טהור בגוון שנהב עדין. הבד הרך והמפנק מתאים לכל עונות השנה ומעניק מראה אלגנטי ומכובד. ניתן לקשור במגוון סגנונות.",
    priceCents: 28900,
    collectionIds: ["signature-collection", "silk-dreams"],
    skuBase: "SILK-SQ",
    isFeatured: true,
    isNew: false,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-001-ivory",
        sku: "SILK-SQ-IVR-OS",
        color: "שנהב",
        fabric: "משי",
        stockQty: 15,
        imageUrls: [
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
        ],
      },
      {
        id: "var-001-blush",
        sku: "SILK-SQ-BLS-OS",
        color: "ורוד עתיק",
        fabric: "משי",
        stockQty: 8,
        imageUrls: [
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-002",
    slug: "navy-velvet-pre-tied",
    title: "טישל קטיפה קשור מראש — כחול כהה",
    description:
      "טישל קטיפה קשור מראש בגוון כחול כהה עמוק. עשיר ומפואר, מתאים במיוחד לשבת ולאירועים.",
    priceCents: 34900,
    collectionIds: ["signature-collection"],
    skuBase: "VLV-PT",
    isFeatured: true,
    isNew: true,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-002-navy",
        sku: "VLV-PT-NVY-OS",
        color: "כחול כהה",
        fabric: "קטיפה",
        stockQty: 12,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-003",
    slug: "cashmere-wrap-stone",
    title: "עטיפת קשמיר — אבן",
    description: "עטיפת ראש מקשמיר רך במיוחד בגוון אבן חמים. תחושה מפנקת ומראה יוקרתי.",
    priceCents: 45900,
    comparePriceCents: 52900,
    collectionIds: ["signature-collection", "everyday-elegance"],
    skuBase: "CSH-WR",
    isFeatured: true,
    isNew: false,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-003-stone",
        sku: "CSH-WR-STN-OS",
        color: "אבן",
        fabric: "קשמיר",
        stockQty: 6,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
      {
        id: "var-003-camel",
        sku: "CSH-WR-CML-OS",
        color: "קאמל",
        fabric: "קשמיר",
        stockQty: 4,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-004",
    slug: "linen-everyday-scarf-sage",
    title: "צעיף פשתן יומיומי — ירוק מרווה",
    description: "צעיף פשתן קל ונושם בגוון ירוק מרווה. אידיאלי ליומיום ולקיץ.",
    priceCents: 18900,
    collectionIds: ["everyday-elegance"],
    skuBase: "LIN-SC",
    isFeatured: false,
    isNew: true,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-004-sage",
        sku: "LIN-SC-SAG-OS",
        color: "ירוק מרווה",
        fabric: "פשתן",
        stockQty: 22,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-004-dusty-rose",
        sku: "LIN-SC-DSR-OS",
        color: "ורוד אבקתי",
        fabric: "פשתן",
        stockQty: 18,
        imageUrls: [
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-005",
    slug: "bridal-lace-tichel",
    title: "טישל תחרה לכלות — לבן",
    description:
      "טישל תחרה עדין ומרהיב ליום החתונה. עיטורי תחרה צרפתית על בד משי לבן. כולל סיכת פנינה מתנה.",
    priceCents: 69900,
    collectionIds: ["bridal"],
    skuBase: "BRD-LC",
    isFeatured: true,
    isNew: false,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-005-white",
        sku: "BRD-LC-WHT-OS",
        color: "לבן",
        fabric: "תחרה על משי",
        stockQty: 5,
        imageUrls: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
        ],
      },
      {
        id: "var-005-champagne",
        sku: "BRD-LC-CHP-OS",
        color: "שמפניה",
        fabric: "תחרה על משי",
        stockQty: 3,
        imageUrls: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-006",
    slug: "cotton-turban-terracotta",
    title: "טורבן כותנה — טרקוטה",
    description: "טורבן כותנה אורגנית בגוון טרקוטה חם. קל להרכבה ונוח לשימוש יומיומי.",
    priceCents: 14900,
    collectionIds: ["everyday-elegance"],
    skuBase: "CTN-TB",
    isFeatured: false,
    isNew: true,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-006-terracotta",
        sku: "CTN-TB-TRC-OS",
        color: "טרקוטה",
        fabric: "כותנה",
        stockQty: 30,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-006-charcoal",
        sku: "CTN-TB-CHR-OS",
        color: "פחם",
        fabric: "כותנה",
        stockQty: 25,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-006-white",
        sku: "CTN-TB-WHT-OS",
        color: "לבן",
        fabric: "כותנה",
        stockQty: 20,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-007",
    slug: "silk-headband-gold",
    title: "סרט ראש משי — זהב",
    description:
      "סרט ראש ממשי בגוון זהב מוברש. משתלב בצורה מושלמת עם כל כיסוי ראש ומוסיף נגיעה של יוקרה.",
    priceCents: 8900,
    collectionIds: ["accessories"],
    skuBase: "SLK-HB",
    isFeatured: false,
    isNew: false,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-007-gold",
        sku: "SLK-HB-GLD-OS",
        color: "זהב",
        fabric: "משי",
        stockQty: 40,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
      {
        id: "var-007-silver",
        sku: "SLK-HB-SLV-OS",
        color: "כסף",
        fabric: "משי",
        stockQty: 35,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-008",
    slug: "shabbat-velvet-wrap-burgundy",
    title: "עטיפת קטיפה לשבת — בורדו",
    description: "עטיפת קטיפה עשירה בגוון בורדו עמוק. מושלמת לשבת ולחגים.",
    priceCents: 38900,
    collectionIds: ["signature-collection"],
    skuBase: "VLV-WR",
    isFeatured: true,
    isNew: false,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-008-burgundy",
        sku: "VLV-WR-BRG-OS",
        color: "בורדו",
        fabric: "קטיפה",
        stockQty: 9,
        imageUrls: [
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-008-forest",
        sku: "VLV-WR-FOR-OS",
        color: "ירוק יער",
        fabric: "קטיפה",
        stockQty: 7,
        imageUrls: [
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-009",
    slug: "pearl-tichel-pin-set",
    title: "סט סיכות פנינה לטישל",
    description:
      "סט של 6 סיכות פנינה אלגנטיות. מאבטחות את הכיסוי ומוסיפות נגיעה קלאסית. מגיעות בקופסת מתנה מעוצבת.",
    priceCents: 12900,
    comparePriceCents: 15900,
    collectionIds: ["accessories"],
    skuBase: "ACC-PIN",
    isFeatured: false,
    isNew: false,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-009-pearl",
        sku: "ACC-PIN-PRL-6",
        color: "פנינה",
        fabric: "מתכת מצופה זהב",
        stockQty: 50,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-010",
    slug: "modal-jersey-tichel-black",
    title: "טישל ג׳רזי מודל — שחור",
    description:
      "טישל ג׳רזי מודל רך במיוחד בגוון שחור קלאסי. הבד הנושם מתאים לכל יום ולכל מזג אוויר.",
    priceCents: 16900,
    collectionIds: ["everyday-elegance"],
    skuBase: "MOD-JR",
    isFeatured: false,
    isNew: false,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-010-black",
        sku: "MOD-JR-BLK-OS",
        color: "שחור",
        fabric: "ג׳רזי מודל",
        stockQty: 35,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-010-navy",
        sku: "MOD-JR-NVY-OS",
        color: "כחול כהה",
        fabric: "ג׳רזי מודל",
        stockQty: 28,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-011",
    slug: "silk-chiffon-wrap-dusty-pink",
    title: "עטיפת שיפון משי — ורוד אבקתי",
    description:
      "עטיפת שיפון משי קלילה בגוון ורוד אבקתי רומנטי. מושלמת לאירועים ולימי קיץ.",
    priceCents: 32900,
    collectionIds: ["silk-dreams"],
    skuBase: "SLK-CH",
    isFeatured: true,
    isNew: true,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-011-dusty-pink",
        sku: "SLK-CH-DPK-OS",
        color: "ורוד אבקתי",
        fabric: "שיפון משי",
        stockQty: 10,
        imageUrls: [
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
        ],
      },
      {
        id: "var-011-lavender",
        sku: "SLK-CH-LVN-OS",
        color: "לבנדר",
        fabric: "שיפון משי",
        stockQty: 0,
        imageUrls: [
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-012",
    slug: "bridal-crystal-headpiece",
    title: "קישוט קריסטל לכלות",
    description:
      "קישוט ראש עדין עם קריסטלים של סברובסקי. מתלבש על הטישל ומעניק נגיעה מנצנצת ומרהיבה ליום החתונה.",
    priceCents: 24900,
    collectionIds: ["bridal", "accessories"],
    skuBase: "BRD-CR",
    isFeatured: false,
    isNew: true,
    publishedAt: now,
    createdAt: now,
    variants: [
      {
        id: "var-012-crystal",
        sku: "BRD-CR-CLR-OS",
        color: "קריסטל שקוף",
        fabric: "קריסטל סברובסקי",
        stockQty: 8,
        imageUrls: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        ],
      },
    ],
  },
];

async function seed() {
  const db = init();
  const batch = db.batch();

  console.warn("Seeding collections...");
  for (const col of collections) {
    const { id, ...data } = col;
    batch.set(db.collection("collections").doc(id), data);
  }

  console.warn("Seeding products...");
  for (const product of products) {
    const { id, variants, ...productData } = product;
    batch.set(db.collection("products").doc(id), productData);

    for (const variant of variants) {
      const { id: variantId, ...variantData } = variant;
      batch.set(
        db.collection("products").doc(id).collection("variants").doc(variantId),
        variantData,
      );
    }
  }

  await batch.commit();
  console.warn(
    `✓ Seeded ${collections.length} collections and ${products.length} products`,
  );
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
