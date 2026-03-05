import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminDb } from "@/lib/firebase/admin";
import { sendOrderConfirmation } from "@/lib/email/send-order-confirmation";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
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
        const orderData = orderDoc.data();

        if (orderData.status === "payment_confirmed") {
          break;
        }

        await orderDoc.ref.update({
          status: "payment_confirmed",
          stripeEventId: event.id,
          updatedAt: new Date(),
        });
        console.warn(`Order ${orderDoc.id} → payment_confirmed`);

        const recipientEmail = orderData.guestEmail || orderData.userId;
        if (
          recipientEmail &&
          typeof recipientEmail === "string" &&
          recipientEmail.includes("@")
        ) {
          await sendOrderConfirmation({
            to: recipientEmail,
            orderId: orderDoc.id,
            items: (orderData.items ?? []).map(
              (item: {
                productTitle?: string;
                quantity: number;
                unitPriceCents: number;
              }) => ({
                name: item.productTitle ?? "Item",
                quantity: item.quantity,
                priceCents: item.unitPriceCents,
              }),
            ),
            subtotalCents: orderData.subtotalCents ?? 0,
            shippingCents: orderData.shippingCents ?? 0,
            taxCents: orderData.taxCents ?? 0,
            totalCents: orderData.totalCents ?? 0,
          });
        }
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
        const orderData = orderDoc.data();

        if (orderData.status === "cancelled") {
          break;
        }

        await orderDoc.ref.update({
          status: "cancelled",
          stripeEventId: event.id,
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
