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
import { join } from "path";

const EMULATOR_HOST = "127.0.0.1:8080";

function init(): Firestore {
  const useEmulator = process.env.SEED_PRODUCTION !== "true";

  if (useEmulator) {
    process.env.FIRESTORE_EMULATOR_HOST = EMULATOR_HOST;
    console.warn(`→ Targeting Firestore emulator at ${EMULATOR_HOST}`);
  } else {
    console.warn("→ Targeting PRODUCTION Firestore");
  }

  if (!getApps().length) {
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

  return getFirestore();
}

const now = Timestamp.now();

const collections = [
  {
    id: "signature-collection",
    slug: { he: "signature-collection", en: "signature-collection" },
    title: { he: "הקולקציה החתימתית", en: "Signature Collection" },
    description: {
      he: "הפריטים המובחרים שלנו — עיצובים קלאסיים מבדים יוקרתיים",
      en: "Our finest pieces — classic designs in luxurious fabrics",
    },
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    displayOrder: 1,
    publishedAt: now,
  },
  {
    id: "silk-dreams",
    slug: { he: "silk-dreams", en: "silk-dreams" },
    title: { he: "חלומות משי", en: "Silk Dreams" },
    description: {
      he: "טישלים ממשי טהור — רכות, אלגנטיות ונוחות לאורך כל היום",
      en: "Pure silk tichels — soft, elegant, and comfortable all day long",
    },
    imageUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    displayOrder: 2,
    publishedAt: now,
  },
  {
    id: "everyday-elegance",
    slug: { he: "everyday-elegance", en: "everyday-elegance" },
    title: { he: "אלגנטיות יומיומית", en: "Everyday Elegance" },
    description: {
      he: "צעיפים נוחים ומעוצבים ליומיום — כי כל יום ראוי ליופי",
      en: "Comfortable and stylish scarves for every day — because every day deserves beauty",
    },
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    displayOrder: 3,
    publishedAt: now,
  },
  {
    id: "bridal",
    slug: { he: "bridal", en: "bridal" },
    title: { he: "קולקציית כלות", en: "Bridal Collection" },
    description: {
      he: "כיסויי ראש לכלות — עיצובים מרהיבים ליום המיוחד",
      en: "Bridal head coverings — stunning designs for your special day",
    },
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    displayOrder: 4,
    publishedAt: now,
  },
  {
    id: "accessories",
    slug: { he: "accessories", en: "accessories" },
    title: { he: "אביזרים", en: "Accessories" },
    description: {
      he: "סיכות, קשתות ופרטים קטנים שמשלימים את המראה",
      en: "Pins, headbands, and details that complete the look",
    },
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    displayOrder: 5,
    publishedAt: now,
  },
];

interface VariantSeed {
  id: string;
  sku: string;
  color: { he: string; en: string };
  fabric: { he: string; en: string };
  stockQty: number;
  imageUrls: string[];
}

interface ProductSeed {
  id: string;
  slug: { he: string; en: string };
  title: { he: string; en: string };
  description: { he: string; en: string };
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
    slug: { he: "ivory-silk-square-tichel", en: "ivory-silk-square-tichel" },
    title: { he: "טישל משי מרובע — שנהב", en: "Ivory Silk Square Tichel" },
    description: {
      he: "טישל מרובע ממשי טהור בגוון שנהב עדין. הבד הרך והמפנק מתאים לכל עונות השנה ומעניק מראה אלגנטי ומכובד. ניתן לקשור במגוון סגנונות.",
      en: "A square tichel made from pure silk in a delicate ivory shade. The soft, luxurious fabric suits all seasons and offers an elegant, dignified look.",
    },
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
        color: { he: "שנהב", en: "Ivory" },
        fabric: { he: "משי", en: "Silk" },
        stockQty: 15,
        imageUrls: [
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
        ],
      },
      {
        id: "var-001-blush",
        sku: "SILK-SQ-BLS-OS",
        color: { he: "ורוד עתיק", en: "Blush" },
        fabric: { he: "משי", en: "Silk" },
        stockQty: 8,
        imageUrls: [
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-002",
    slug: { he: "navy-velvet-pre-tied", en: "navy-velvet-pre-tied" },
    title: {
      he: "טישל קטיפה קשור מראש — כחול כהה",
      en: "Navy Velvet Pre-Tied Tichel",
    },
    description: {
      he: "טישל קטיפה קשור מראש בגוון כחול כהה עמוק. עשיר ומפואר, מתאים במיוחד לשבת ולאירועים.",
      en: "A pre-tied velvet tichel in deep navy. Rich and opulent, perfect for Shabbat and events.",
    },
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
        color: { he: "כחול כהה", en: "Navy" },
        fabric: { he: "קטיפה", en: "Velvet" },
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
    slug: { he: "cashmere-wrap-stone", en: "cashmere-wrap-stone" },
    title: { he: "עטיפת קשמיר — אבן", en: "Cashmere Wrap — Stone" },
    description: {
      he: "עטיפת ראש מקשמיר רך במיוחד בגוון אבן חמים. תחושה מפנקת ומראה יוקרתי.",
      en: "An incredibly soft cashmere head wrap in warm stone. Luxurious feel and elegant look.",
    },
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
        color: { he: "אבן", en: "Stone" },
        fabric: { he: "קשמיר", en: "Cashmere" },
        stockQty: 6,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
      {
        id: "var-003-camel",
        sku: "CSH-WR-CML-OS",
        color: { he: "קאמל", en: "Camel" },
        fabric: { he: "קשמיר", en: "Cashmere" },
        stockQty: 4,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-004",
    slug: {
      he: "linen-everyday-scarf-sage",
      en: "linen-everyday-scarf-sage",
    },
    title: {
      he: "צעיף פשתן יומיומי — ירוק מרווה",
      en: "Linen Everyday Scarf — Sage",
    },
    description: {
      he: "צעיף פשתן קל ונושם בגוון ירוק מרווה. אידיאלי ליומיום ולקיץ.",
      en: "A light and breathable linen scarf in sage green. Ideal for everyday wear and summer.",
    },
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
        color: { he: "ירוק מרווה", en: "Sage" },
        fabric: { he: "פשתן", en: "Linen" },
        stockQty: 22,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-004-dusty-rose",
        sku: "LIN-SC-DSR-OS",
        color: { he: "ורוד אבקתי", en: "Dusty Rose" },
        fabric: { he: "פשתן", en: "Linen" },
        stockQty: 18,
        imageUrls: [
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-005",
    slug: { he: "bridal-lace-tichel", en: "bridal-lace-tichel" },
    title: {
      he: "טישל תחרה לכלות — לבן",
      en: "Bridal Lace Tichel — White",
    },
    description: {
      he: "טישל תחרה עדין ומרהיב ליום החתונה. עיטורי תחרה צרפתית על בד משי לבן. כולל סיכת פנינה מתנה.",
      en: "A delicate and stunning lace tichel for your wedding day. French lace details on white silk. Includes a complimentary pearl pin.",
    },
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
        color: { he: "לבן", en: "White" },
        fabric: { he: "תחרה על משי", en: "Lace on Silk" },
        stockQty: 5,
        imageUrls: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
        ],
      },
      {
        id: "var-005-champagne",
        sku: "BRD-LC-CHP-OS",
        color: { he: "שמפניה", en: "Champagne" },
        fabric: { he: "תחרה על משי", en: "Lace on Silk" },
        stockQty: 3,
        imageUrls: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-006",
    slug: {
      he: "cotton-turban-terracotta",
      en: "cotton-turban-terracotta",
    },
    title: {
      he: "טורבן כותנה — טרקוטה",
      en: "Cotton Turban — Terracotta",
    },
    description: {
      he: "טורבן כותנה אורגנית בגוון טרקוטה חם. קל להרכבה ונוח לשימוש יומיומי.",
      en: "An organic cotton turban in warm terracotta. Easy to wear and comfortable for daily use.",
    },
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
        color: { he: "טרקוטה", en: "Terracotta" },
        fabric: { he: "כותנה", en: "Cotton" },
        stockQty: 30,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-006-charcoal",
        sku: "CTN-TB-CHR-OS",
        color: { he: "פחם", en: "Charcoal" },
        fabric: { he: "כותנה", en: "Cotton" },
        stockQty: 25,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-006-white",
        sku: "CTN-TB-WHT-OS",
        color: { he: "לבן", en: "White" },
        fabric: { he: "כותנה", en: "Cotton" },
        stockQty: 20,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-007",
    slug: { he: "silk-headband-gold", en: "silk-headband-gold" },
    title: { he: "סרט ראש משי — זהב", en: "Silk Headband — Gold" },
    description: {
      he: "סרט ראש ממשי בגוון זהב מוברש. משתלב בצורה מושלמת עם כל כיסוי ראש ומוסיף נגיעה של יוקרה.",
      en: "A silk headband in brushed gold. Perfectly complements any head covering and adds a touch of luxury.",
    },
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
        color: { he: "זהב", en: "Gold" },
        fabric: { he: "משי", en: "Silk" },
        stockQty: 40,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
      {
        id: "var-007-silver",
        sku: "SLK-HB-SLV-OS",
        color: { he: "כסף", en: "Silver" },
        fabric: { he: "משי", en: "Silk" },
        stockQty: 35,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-008",
    slug: {
      he: "shabbat-velvet-wrap-burgundy",
      en: "shabbat-velvet-wrap-burgundy",
    },
    title: {
      he: "עטיפת קטיפה לשבת — בורדו",
      en: "Shabbat Velvet Wrap — Burgundy",
    },
    description: {
      he: "עטיפת קטיפה עשירה בגוון בורדו עמוק. מושלמת לשבת ולחגים.",
      en: "A rich velvet wrap in deep burgundy. Perfect for Shabbat and holidays.",
    },
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
        color: { he: "בורדו", en: "Burgundy" },
        fabric: { he: "קטיפה", en: "Velvet" },
        stockQty: 9,
        imageUrls: [
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-008-forest",
        sku: "VLV-WR-FOR-OS",
        color: { he: "ירוק יער", en: "Forest Green" },
        fabric: { he: "קטיפה", en: "Velvet" },
        stockQty: 7,
        imageUrls: [
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-009",
    slug: { he: "pearl-tichel-pin-set", en: "pearl-tichel-pin-set" },
    title: { he: "סט סיכות פנינה לטישל", en: "Pearl Tichel Pin Set" },
    description: {
      he: "סט של 6 סיכות פנינה אלגנטיות. מאבטחות את הכיסוי ומוסיפות נגיעה קלאסית. מגיעות בקופסת מתנה מעוצבת.",
      en: "A set of 6 elegant pearl pins. Secure your covering while adding a classic touch. Arrives in a designed gift box.",
    },
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
        color: { he: "פנינה", en: "Pearl" },
        fabric: { he: "מתכת מצופה זהב", en: "Gold-plated metal" },
        stockQty: 50,
        imageUrls: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-010",
    slug: {
      he: "modal-jersey-tichel-black",
      en: "modal-jersey-tichel-black",
    },
    title: {
      he: "טישל ג׳רזי מודל — שחור",
      en: "Modal Jersey Tichel — Black",
    },
    description: {
      he: "טישל ג׳רזי מודל רך במיוחד בגוון שחור קלאסי. הבד הנושם מתאים לכל יום ולכל מזג אוויר.",
      en: "An ultra-soft modal jersey tichel in classic black. The breathable fabric suits every day and weather.",
    },
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
        color: { he: "שחור", en: "Black" },
        fabric: { he: "ג׳רזי מודל", en: "Modal Jersey" },
        stockQty: 35,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
      {
        id: "var-010-navy",
        sku: "MOD-JR-NVY-OS",
        color: { he: "כחול כהה", en: "Navy" },
        fabric: { he: "ג׳רזי מודל", en: "Modal Jersey" },
        stockQty: 28,
        imageUrls: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-011",
    slug: {
      he: "silk-chiffon-wrap-dusty-pink",
      en: "silk-chiffon-wrap-dusty-pink",
    },
    title: {
      he: "עטיפת שיפון משי — ורוד אבקתי",
      en: "Silk Chiffon Wrap — Dusty Pink",
    },
    description: {
      he: "עטיפת שיפון משי קלילה בגוון ורוד אבקתי רומנטי. מושלמת לאירועים ולימי קיץ.",
      en: "A light silk chiffon wrap in romantic dusty pink. Perfect for events and summer days.",
    },
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
        color: { he: "ורוד אבקתי", en: "Dusty Pink" },
        fabric: { he: "שיפון משי", en: "Silk Chiffon" },
        stockQty: 10,
        imageUrls: [
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
        ],
      },
      {
        id: "var-011-lavender",
        sku: "SLK-CH-LVN-OS",
        color: { he: "לבנדר", en: "Lavender" },
        fabric: { he: "שיפון משי", en: "Silk Chiffon" },
        stockQty: 0,
        imageUrls: [
          "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
        ],
      },
    ],
  },
  {
    id: "prod-012",
    slug: {
      he: "bridal-crystal-headpiece",
      en: "bridal-crystal-headpiece",
    },
    title: {
      he: "קישוט קריסטל לכלות",
      en: "Bridal Crystal Headpiece",
    },
    description: {
      he: "קישוט ראש עדין עם קריסטלים של סברובסקי. מתלבש על הטישל ומעניק נגיעה מנצנצת ומרהיבה ליום החתונה.",
      en: "A delicate headpiece with Swarovski crystals. Sits on top of the tichel and adds a sparkling, stunning touch to your wedding day.",
    },
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
        color: { he: "קריסטל שקוף", en: "Clear Crystal" },
        fabric: { he: "קריסטל סברובסקי", en: "Swarovski Crystal" },
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

seed().catch(console.error);
