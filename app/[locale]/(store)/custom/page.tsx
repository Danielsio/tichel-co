"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { createCustomRequestSchema } from "@/lib/validations/custom-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export default function CustomPage() {
  const t = useTranslations("custom");
  const tAuth = useTranslations("auth");
  const { user, loading: authLoading } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name") as string,
      contactEmail: formData.get("email") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string,
      budgetRange: (formData.get("budget") as string) || undefined,
    };

    const parsed = createCustomRequestSchema.safeParse(raw);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "customRequests"), {
        ...parsed.data,
        userId: user!.uid,
        status: "submitted",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setError(t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 lg:px-6">
        <div className="bg-stone h-8 w-48 animate-pulse rounded" />
        <div className="bg-stone mt-6 h-64 animate-pulse rounded" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {/* Header */}
        <section className="gradient-luxury relative overflow-hidden py-16 lg:py-20">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative mx-auto max-w-2xl px-4 text-center lg:px-6">
            <h1 className="font-display text-ivory text-3xl font-semibold text-balance lg:text-5xl">
              {t("title")}
            </h1>
          </div>
        </section>

        <div className="flex min-h-[40vh] items-center justify-center px-4">
          <div className="w-full max-w-sm text-center">
            <p className="text-charcoal/50 text-sm">{t("loginRequired")}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login">
                <Button size="lg" fullWidth>
                  {tAuth("loginButton")}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg" fullWidth>
                  {tAuth("registerButton")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-gold mx-auto mb-6 text-4xl">✦</div>
          <h1 className="font-display text-navy text-3xl font-semibold">
            {t("successTitle")}
          </h1>
          <p className="text-charcoal/50 mx-auto mt-5 max-w-sm text-[14px] leading-relaxed">
            {t("successText")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="gradient-luxury relative overflow-hidden py-16 lg:py-20">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center lg:px-6">
          <p className="text-gold mb-3 text-[11px] font-semibold tracking-[0.3em] uppercase">
            {t("subtitle")}
          </p>
          <h1 className="font-display text-ivory text-3xl font-semibold text-balance lg:text-5xl">
            {t("title")}
          </h1>
          <p className="text-ivory/40 mx-auto mt-5 max-w-lg text-[14px] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-xl px-4 py-16 lg:px-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input label={t("nameLabel")} id="name" name="name" required />

          <Input
            label={t("emailLabel")}
            id="email"
            name="email"
            type="email"
            defaultValue={user?.email ?? ""}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="type" className="text-navy text-[13px] font-medium">
              {t("typeLabel")}
            </label>
            <Select id="type" name="type" required defaultValue="">
              <option value="" disabled>
                {t("typePlaceholder")}
              </option>
              <option value="tichel">{t("typeTichel")}</option>
              <option value="scarf">{t("typeScarf")}</option>
              <option value="head-wrap">{t("typeHeadWrap")}</option>
              <option value="other">{t("typeOther")}</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-navy text-[13px] font-medium">
              {t("descriptionLabel")}
            </label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              placeholder={t("descriptionPlaceholder")}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="budget" className="text-navy text-[13px] font-medium">
              {t("budgetLabel")}
            </label>
            <Select id="budget" name="budget" required defaultValue="">
              <option value="" disabled>
                {t("budgetPlaceholder")}
              </option>
              <option value="under-100">{t("budget1")}</option>
              <option value="100-200">{t("budget2")}</option>
              <option value="200-400">{t("budget3")}</option>
              <option value="400-plus">{t("budget4")}</option>
            </Select>
          </div>

          {error && (
            <p className="text-error text-[13px]" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2">
            {t("submitButton")}
          </Button>
        </form>
      </section>
    </>
  );
}
