"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { Link } from "@/lib/i18n/navigation";
import { signUp, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons/google";

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
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <h1 className="font-display text-navy text-3xl font-semibold lg:text-4xl">
            {t("registerTitle")}
          </h1>
          <p className="text-charcoal/40 mt-3 text-[14px]">
            {t("hasAccount")}{" "}
            <Link
              href="/login"
              className="text-navy font-medium underline underline-offset-4 hover:no-underline"
            >
              {t("loginLink")}
            </Link>
          </p>
        </div>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleGoogle}
          type="button"
          iconStart={<GoogleIcon className="h-5 w-5" />}
          className="mb-8 tracking-normal normal-case"
        >
          {t("googleButton")}
        </Button>

        <div className="mb-8 flex items-center gap-4">
          <div className="bg-stone-dark h-px flex-1" />
          <span className="text-charcoal/30 text-[11px] tracking-[0.15em] uppercase">
            {t("or")}
          </span>
          <div className="bg-stone-dark h-px flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label={t("email")}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label={t("password")}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <Input
            label={t("confirmPassword")}
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          {error && (
            <div
              className="bg-error/5 border-error/20 rounded-lg border px-4 py-3"
              role="alert"
            >
              <p className="text-error text-[13px]">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-1"
          >
            {t("registerButton")}
          </Button>
        </form>
      </div>
    </div>
  );
}
