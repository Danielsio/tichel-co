"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/hooks/use-auth";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils/format-price";

type Step = "info" | "shipping" | "payment";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const router = useRouter();
  const mounted = useMounted();
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<Step>("info");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: user?.email ?? "",
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    country: "IL",
    postalCode: "",
  });

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (!mounted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
        <div className="bg-stone h-96 animate-pulse rounded-sm" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center lg:px-6">
        <h1 className="font-display text-navy text-2xl font-semibold">
          {tCart("empty")}
        </h1>
      </div>
    );
  }

  const steps: Step[] = ["info", "shipping", "payment"];
  const stepIndex = steps.indexOf(step);

  const handlePlaceOrder = async () => {
    setError("");
    setIsProcessing(true);

    try {
      const orderItems = items.map((item) => ({
        variantId: item.variantId,
        productId: item.productId,
        productTitle: item.name,
        variantLabel: `${item.color} · ${item.size}`,
        imageUrl: item.image,
        quantity: item.quantity,
        unitPriceCents: item.price,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          currency: "ils",
          userId: user?.uid ?? null,
          guestEmail: user ? null : form.email,
          shippingAddress: {
            label: "Shipping",
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            country: form.country,
            postalCode: form.postalCode,
            isDefault: false,
          },
        }),
      });

      const result = await res.json();

      if (result.error) {
        setError(result.error.message);
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${result.data.orderId}` as never);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">{t("title")}</h1>

      {/* Progress Bar */}
      <div className="mt-8 flex items-center gap-2">
        {steps.map((s, idx) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                idx <= stepIndex ? "bg-gold text-navy" : "bg-stone text-charcoal/40"
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`hidden text-sm sm:block ${
                idx <= stepIndex ? "text-navy font-medium" : "text-charcoal/40"
              }`}
            >
              {t(`steps.${s}`)}
            </span>
            {idx < steps.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 ${
                  idx < stepIndex ? "bg-gold" : "bg-stone"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          {step === "info" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-navy text-lg font-semibold">{t("steps.info")}</h2>
              {!user && (
                <div>
                  <label className="text-navy mb-1.5 block text-sm font-medium">
                    {t("steps.info")} — Email
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-navy mb-1.5 block text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-navy mb-1.5 block text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button size="lg" onClick={() => setStep("shipping")} className="mt-4">
                Continue to Shipping
              </Button>
            </div>
          )}

          {step === "shipping" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-navy text-lg font-semibold">{t("steps.shipping")}</h2>
              <div>
                <label className="text-navy mb-1.5 block text-sm font-medium">
                  Address
                </label>
                <Input
                  value={form.line1}
                  onChange={(e) => updateForm("line1", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-navy mb-1.5 block text-sm font-medium">
                  Apartment / Suite (optional)
                </label>
                <Input
                  value={form.line2}
                  onChange={(e) => updateForm("line2", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-navy mb-1.5 block text-sm font-medium">
                    City
                  </label>
                  <Input
                    value={form.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-navy mb-1.5 block text-sm font-medium">
                    Postal Code
                  </label>
                  <Input
                    value={form.postalCode}
                    onChange={(e) => updateForm("postalCode", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="ghost" onClick={() => setStep("info")}>
                  Back
                </Button>
                <Button size="lg" onClick={() => setStep("payment")} className="flex-1">
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-navy text-lg font-semibold">{t("steps.payment")}</h2>

              {/* Stripe Elements placeholder — in production, integrate @stripe/react-stripe-js here */}
              <div className="border-stone rounded-sm border p-6">
                <p className="text-charcoal/60 text-sm">
                  Stripe Elements will be rendered here. For testing, the order is
                  created directly via the API.
                </p>
                <div className="bg-stone mt-4 rounded-sm p-4">
                  <p className="text-charcoal/50 text-xs">
                    Test card: 4242 4242 4242 4242 · Any future date · Any CVC
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-error text-sm" role="alert">
                  {error}
                </p>
              )}

              <p className="text-charcoal/50 text-xs">{t("freeReturns")}</p>

              <div className="mt-2 flex gap-3">
                <Button variant="ghost" onClick={() => setStep("shipping")}>
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handlePlaceOrder}
                  isLoading={isProcessing}
                  className="flex-1"
                >
                  {t("continueToPay")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-stone sticky top-28 rounded-sm p-6">
            <h3 className="text-navy mb-4 text-sm font-semibold">
              {t("orderSummary")}
            </h3>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-center gap-3">
                  <div className="bg-ivory h-12 w-10 shrink-0 overflow-hidden rounded-sm">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-navy text-xs font-medium">{item.name}</p>
                    <p className="text-charcoal/40 text-[10px]">
                      {item.color} · ×{item.quantity}
                    </p>
                  </div>
                  <span className="text-charcoal/70 text-xs font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-charcoal/10 mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-navy text-sm font-semibold">
                  {tCart("total")}
                </span>
                <span className="text-navy text-lg font-semibold">
                  {formatPrice(totalPrice())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
