import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminAuth } from "@/lib/firebase/admin";
import { lookupProductPrice } from "@/lib/firebase/admin-queries";

const checkoutItemSchema = z.object({
  variantId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
  productTitle: z.string().optional(),
  variantLabel: z.string().optional(),
  imageUrl: z.string().optional(),
  unitPriceCents: z.number().optional(),
});

const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Cart is empty"),
  currency: z.enum(["ils", "usd", "eur"]).default("ils"),
  userId: z.string().nullable().optional(),
  guestEmail: z.string().email().nullable().optional(),
  shippingAddress: z
    .object({
      label: z.string().optional(),
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      country: z.string().min(1),
      postalCode: z.string().optional(),
      isDefault: z.boolean().optional(),
    })
    .nullable()
    .optional(),
});

async function verifyAuthToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    const decoded = await getAdminAuth().verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            message: parsed.error.issues[0]?.message ?? "Invalid input",
            code: "VALIDATION_ERROR",
          },
        },
        { status: 400 },
      );
    }

    const { items, currency, shippingAddress, guestEmail } = parsed.data;

    const verifiedUid = await verifyAuthToken(req);
    const userId = verifiedUid ?? null;

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: { message: "Payment not configured", code: "CONFIG_ERROR" } },
        { status: 500 },
      );
    }

    const verifiedItems = await Promise.all(
      items.map(async (item) => {
        const serverPrice = await lookupProductPrice(item.productId, item.variantId);
        if (serverPrice === null) {
          throw new Error(
            `Product/variant not found: ${item.productId}/${item.variantId}`,
          );
        }
        return { ...item, unitPriceCents: serverPrice };
      }),
    );

    const totalCents = verifiedItems.reduce(
      (sum, item) => sum + item.unitPriceCents * item.quantity,
      0,
    );

    if (totalCents <= 0) {
      return NextResponse.json(
        { error: { message: "Invalid order total", code: "INVALID_TOTAL" } },
        { status: 400 },
      );
    }

    const stripe = new Stripe(secretKey);

    const adminDb = getAdminDb();
    const orderRef = adminDb.collection("orders").doc();

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: totalCents,
        currency,
        metadata: { source: "tichel-co", orderId: orderRef.id },
      },
      { idempotencyKey: `checkout_${orderRef.id}` },
    );

    await orderRef.set({
      userId,
      guestEmail: guestEmail ?? null,
      status: "pending_payment",
      subtotalCents: totalCents,
      shippingCents: 0,
      taxCents: 0,
      totalCents,
      currency,
      stripePaymentIntentId: paymentIntent.id,
      shippingAddress: shippingAddress ?? null,
      items: verifiedItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      data: {
        clientSecret: paymentIntent.client_secret,
        orderId: orderRef.id,
      },
      error: null,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json(
      { error: { message, code: "CHECKOUT_ERROR" } },
      { status: 500 },
    );
  }
}
