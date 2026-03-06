import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-navy text-6xl font-semibold">404</h1>
        <p className="text-charcoal/70 mt-4 text-lg">הדף שחיפשת לא נמצא.</p>
        <Link
          href="/"
          className="border-gold text-gold mt-8 inline-block border-b-2 transition-opacity hover:opacity-80"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}
