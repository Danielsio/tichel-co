import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, currency = "ils", shippingAddress, userId, guestEmail } = body;

    if (!items?.length) {
      return NextResponse.json(
        { error: { message: "Cart is empty", code: "EMPTY_CART" } },
        { status: 400 },
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const totalCents = items.reduce(
      (sum: number, item: { unitPriceCents: number; quantity: number }) =>
        sum + item.unitPriceCents * item.quantity,
      0,
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency,
      metadata: { source: "tichel-co" },
    });

    const adminDb = getAdminDb();
    const orderRef = adminDb.collection("orders").doc();
    await orderRef.set({
      userId: userId ?? null,
      guestEmail: guestEmail ?? null,
      status: "pending_payment",
      subtotalCents: totalCents,
      shippingCents: 0,
      taxCents: 0,
      totalCents,
      currency,
      stripePaymentIntentId: paymentIntent.id,
      shippingAddress: shippingAddress ?? null,
      items,
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
    return NextResponse.json(
      { error: { message: "Checkout failed", code: "CHECKOUT_ERROR" } },
      { status: 500 },
    );
  }
}
