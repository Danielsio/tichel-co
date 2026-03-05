import { Link } from "@/lib/i18n/navigation";

const messages = {
  he: { title: "404", text: "הדף שחיפשת לא נמצא.", home: "חזרה לדף הבית" },
  en: {
    title: "404",
    text: "The page you're looking for doesn't exist.",
    home: "Back to Home",
  },
};

export default function NotFound() {
  const t = messages.he;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-navy text-6xl font-semibold">{t.title}</h1>
        <p className="text-charcoal/70 mt-4 text-lg">{t.text}</p>
        <Link
          href="/"
          className="border-gold text-gold mt-8 inline-block border-b-2 transition-opacity hover:opacity-80"
        >
          {t.home}
        </Link>
      </div>
    </div>
  );
}
