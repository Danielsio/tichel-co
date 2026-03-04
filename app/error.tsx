"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-navy text-6xl font-semibold">Error</h1>
        <p className="text-charcoal/70 mt-4 text-lg">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="border-gold text-gold mt-8 inline-block cursor-pointer border-b-2 transition-opacity hover:opacity-80"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
