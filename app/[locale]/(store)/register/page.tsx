"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { Link } from "@/lib/i18n/navigation";
import { signUp, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("errorMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("errorWeakPassword"));
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      router.push("/account");
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
      router.push("/account");
    } catch {
      setError(t("errorGeneric"));
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16 lg:px-6">
      <h1 className="font-display text-navy text-center text-3xl font-semibold">
        {t("registerTitle")}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-navy mb-1.5 block text-sm font-medium">
            {t("email")}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-navy mb-1.5 block text-sm font-medium"
          >
            {t("password")}
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="text-navy mb-1.5 block text-sm font-medium"
          >
            {t("confirmPassword")}
          </label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-error text-sm" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="mt-2"
        >
          {t("registerButton")}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="bg-stone h-px flex-1" />
        <span className="text-charcoal/40 text-xs uppercase">{t("or")}</span>
        <div className="bg-stone h-px flex-1" />
      </div>

      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={handleGoogle}
        type="button"
      >
        {t("googleButton")}
      </Button>

      <p className="text-charcoal/60 mt-8 text-center text-sm">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-gold font-medium hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}
