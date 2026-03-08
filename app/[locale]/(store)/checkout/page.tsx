"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/hooks/use-auth";
import { useMounted } from "@/hooks/use-mounted";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";

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
        <div className="bg-stone h-96 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <div className="bg-stone mb-5 flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            className="text-charcoal/20 h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
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

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (user) {
        const idToken = await user.getIdToken();
        headers["Authorization"] = `Bearer ${idToken}`;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: orderItems,
          currency: "ils",
          userId: user?.uid ?? null,
          guestEmail: user ? null : form.email,
          shippingAddress: {
            label: t("steps.shipping"),
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
      setError(t("genericError"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 lg:px-6 lg:py-16">
      <h1 className="font-display text-navy text-3xl font-semibold lg:text-4xl">
        {t("title")}
      </h1>

      {/* Progress Steps */}
      <div className="mt-8 flex items-center sm:mt-10">
        {steps.map((s, idx) => (
          <div key={s} className="flex flex-1 items-center">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300",
                  idx < stepIndex && "bg-success text-white",
                  idx === stepIndex && "bg-navy text-ivory ring-navy/10 ring-4",
                  idx > stepIndex && "bg-stone text-charcoal/30",
                )}
              >
                {idx < stepIndex ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={cn(
                  "hidden text-[12px] tracking-wide sm:block",
                  idx <= stepIndex ? "text-navy font-medium" : "text-charcoal/30",
                )}
              >
                {t(`steps.${s}`)}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="mx-3 h-px flex-1 sm:mx-4">
                <div
                  className={cn(
                    "h-full rounded-full transition-colors duration-300",
                    idx < stepIndex ? "bg-success" : "bg-stone",
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-5 lg:gap-12">
        {/* Form */}
        <div className="lg:col-span-3">
          {step === "info" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-navy text-[11px] font-semibold tracking-[0.15em] uppercase">
                {t("steps.info")}
              </h2>
              {!user && (
                <Input
                  label={t("email")}
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  required
                  autoComplete="email"
                />
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={t("firstName")}
                  value={form.firstName}
                  onChange={(e) => updateForm("firstName", e.target.value)}
                  required
                  autoComplete="given-name"
                />
                <Input
                  label={t("lastName")}
                  value={form.lastName}
                  onChange={(e) => updateForm("lastName", e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
              <Button size="lg" onClick={() => setStep("shipping")} className="mt-4">
                {t("continueToShipping")}
              </Button>
            </div>
          )}

          {step === "shipping" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-navy text-[11px] font-semibold tracking-[0.15em] uppercase">
                {t("steps.shipping")}
              </h2>
              <Input
                label={t("address")}
                value={form.line1}
                onChange={(e) => updateForm("line1", e.target.value)}
                required
                autoComplete="address-line1"
              />
              <Input
                label={t("apartment")}
                value={form.line2}
                onChange={(e) => updateForm("line2", e.target.value)}
                autoComplete="address-line2"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={t("city")}
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  required
                  autoComplete="address-level2"
                />
                <Input
                  label={t("postalCode")}
                  value={form.postalCode}
                  onChange={(e) => updateForm("postalCode", e.target.value)}
                  autoComplete="postal-code"
                />
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="ghost" onClick={() => setStep("info")}>
                  {t("back")}
                </Button>
                <Button size="lg" onClick={() => setStep("payment")} className="flex-1">
                  {t("continueToPay")}
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-navy text-[11px] font-semibold tracking-[0.15em] uppercase">
                {t("steps.payment")}
              </h2>

              <div className="border-stone/60 rounded-xl border p-6 sm:p-7">
                <p className="text-charcoal/50 text-[13px]">{t("stripeNote")}</p>
                <div className="bg-stone mt-4 rounded-lg p-4">
                  <p className="text-charcoal/40 text-[11px]">{t("testCard")}</p>
                </div>
              </div>

              {error && (
                <div
                  className="bg-error/5 border-error/20 rounded-lg border px-4 py-3"
                  role="alert"
                >
                  <p className="text-error text-[13px]">{error}</p>
                </div>
              )}

              <p className="text-charcoal/40 text-[11px]">{t("freeReturns")}</p>

              <div className="mt-2 flex gap-3">
                <Button variant="ghost" onClick={() => setStep("shipping")}>
                  {t("back")}
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
          <div className="border-stone/60 sticky top-28 rounded-xl border p-6 sm:p-7">
            <h3 className="text-navy mb-5 text-[11px] font-semibold tracking-[0.15em] uppercase">
              {t("orderSummary")}
            </h3>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-center gap-3">
                  <div className="bg-stone relative h-14 w-11 shrink-0 overflow-hidden rounded-lg">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-navy text-[12px] font-medium">{item.name}</p>
                    <p className="text-charcoal/30 text-[10px]">
                      {item.color} · ×{item.quantity}
                    </p>
                  </div>
                  <span className="text-charcoal/60 text-[12px] font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-stone/60 mt-5 border-t pt-5">
              <div className="flex items-center justify-between">
                <span className="text-navy text-[13px] font-semibold">
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
