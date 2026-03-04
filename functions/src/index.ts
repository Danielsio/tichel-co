import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Stripe webhook handler.
 * Processes payment_intent.succeeded / payment_intent.payment_failed events.
 * Updates Firestore order status and triggers confirmation email.
 */
export const stripeWebhook = onRequest(
  { cors: false, region: "europe-west1" },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    // Webhook handler implementation — Phase 4
    res.status(200).json({ received: true });
  },
);
