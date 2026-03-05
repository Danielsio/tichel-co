"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-navy mb-4 text-4xl font-semibold">
        {t("errorTitle")}
      </h1>
      <p className="text-charcoal/60 mb-8 max-w-md text-[14px]">{t("errorMessage")}</p>
      <Button onClick={reset}>{t("tryAgain")}</Button>
    </div>
  );
}
