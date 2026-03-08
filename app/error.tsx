"use client";

const messages = {
  he: { title: "שגיאה", fallback: "אירעה שגיאה בלתי צפויה.", retry: "נסו שוב" },
  en: { title: "Error", fallback: "An unexpected error occurred.", retry: "Try Again" },
};

function getLocale(): "he" | "en" {
  if (typeof document !== "undefined") {
    return document.documentElement.lang === "en" ? "en" : "he";
  }
  return "he";
}

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = messages[getLocale()];

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-navy text-6xl font-semibold">{t.title}</h1>
        <p className="text-charcoal/70 mt-4 text-lg">{error.message || t.fallback}</p>
        <button
          onClick={reset}
          className="border-gold text-gold mt-8 inline-block cursor-pointer border-b-2 transition-opacity hover:opacity-80"
          aria-label={t.retry}
        >
          {t.retry}
        </button>
      </div>
    </div>
  );
}
