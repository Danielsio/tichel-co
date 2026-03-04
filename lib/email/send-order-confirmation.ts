import { resend, FROM_EMAIL } from "./index";
import { OrderConfirmationEmail } from "./order-confirmation";
import { createElement } from "react";

interface OrderItem {
  name: string;
  quantity: number;
  priceCents: number;
}

interface SendOrderConfirmationParams {
  to: string;
  orderId: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}

export async function sendOrderConfirmation(params: SendOrderConfirmationParams) {
  if (!resend) {
    console.warn("Resend not configured — skipping order confirmation email");
    return;
  }

  try {
    await resend.emails.send({
      from: `Tichel & Co. <${FROM_EMAIL}>`,
      to: params.to,
      subject: `הזמנה #${params.orderId.slice(0, 8)} אושרה — Tichel & Co.`,
      react: createElement(OrderConfirmationEmail, {
        orderId: params.orderId,
        items: params.items,
        subtotalCents: params.subtotalCents,
        shippingCents: params.shippingCents,
        taxCents: params.taxCents,
        totalCents: params.totalCents,
      }),
    });
    console.warn(`Order confirmation sent to ${params.to}`);
  } catch (error) {
    console.error("Failed to send order confirmation:", error);
  }
}
