import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminDb } from "@/lib/firebase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const db = getAdminDb();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const ordersSnap = await db
        .collection("orders")
        .where("stripePaymentIntentId", "==", paymentIntent.id)
        .limit(1)
        .get();

      if (!ordersSnap.empty) {
        const orderDoc = ordersSnap.docs[0]!;
        await orderDoc.ref.update({
          status: "payment_confirmed",
          updatedAt: new Date(),
        });
        console.warn(`Order ${orderDoc.id} → payment_confirmed`);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const ordersSnap = await db
        .collection("orders")
        .where("stripePaymentIntentId", "==", paymentIntent.id)
        .limit(1)
        .get();

      if (!ordersSnap.empty) {
        const orderDoc = ordersSnap.docs[0]!;
        await orderDoc.ref.update({
          status: "cancelled",
          updatedAt: new Date(),
        });
        console.warn(`Order ${orderDoc.id} → cancelled (payment failed)`);
      }
      break;
    }

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
