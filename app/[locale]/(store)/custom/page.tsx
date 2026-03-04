"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export default function CustomPage() {
  const t = useTranslations("custom");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center lg:px-6">
        <div className="text-gold mx-auto mb-6 text-4xl">✦</div>
        <h1 className="font-display text-navy text-3xl font-semibold">
          {t("successTitle")}
        </h1>
        <p className="text-charcoal/60 mx-auto mt-4 max-w-sm text-sm leading-relaxed">
          {t("successText")}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-stone py-16">
        <div className="mx-auto max-w-2xl px-4 text-center lg:px-6">
          <h1 className="font-display text-navy text-4xl font-semibold">
            {t("title")}
          </h1>
          <p className="text-charcoal/60 mx-auto mt-4 max-w-lg text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-xl px-4 py-12 lg:px-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="name"
              className="text-navy mb-1.5 block text-sm font-medium"
            >
              {t("nameLabel")}
            </label>
            <Input id="name" name="name" required />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-navy mb-1.5 block text-sm font-medium"
            >
              {t("emailLabel")}
            </label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div>
            <label
              htmlFor="type"
              className="text-navy mb-1.5 block text-sm font-medium"
            >
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

          <div>
            <label
              htmlFor="description"
              className="text-navy mb-1.5 block text-sm font-medium"
            >
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

          <div>
            <label
              htmlFor="budget"
              className="text-navy mb-1.5 block text-sm font-medium"
            >
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

          <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2">
            {t("submitButton")}
          </Button>
        </form>
      </section>
    </>
  );
}
