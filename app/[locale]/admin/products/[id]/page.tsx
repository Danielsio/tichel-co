"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

interface ProductData {
  title: { he: string; en: string };
  description: { he: string; en: string };
  slug: { he: string; en: string };
  priceCents: number;
  comparePriceCents?: number;
  collectionIds: string[];
  skuBase: string;
  isFeatured: boolean;
  publishedAt: unknown;
}

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default function AdminProductEditPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"he" | "en">("he");

  const [form, setForm] = useState<ProductData>({
    title: { he: "", en: "" },
    description: { he: "", en: "" },
    slug: { he: "", en: "" },
    priceCents: 0,
    comparePriceCents: undefined,
    collectionIds: [],
    skuBase: "",
    isFeatured: false,
    publishedAt: null,
  });

  const isNew = id === "new";

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    async function load() {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        setForm(snap.data() as ProductData);
      }
      setLoading(false);
    }
    load();
  }, [id, isNew]);

  const updateField = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateLocaleField = (
    field: "title" | "description" | "slug",
    locale: "he" | "en",
    value: string,
  ) =>
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [locale]: value },
    }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const ref = doc(db, "products", isNew ? crypto.randomUUID() : id);
      await updateDoc(ref, {
        ...form,
        updatedAt: serverTimestamp(),
      }).catch(async () => {
        const { setDoc } = await import("firebase/firestore");
        await setDoc(ref, {
          ...form,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      toast(t("productSaved"), "success");
      if (isNew) router.push("/admin/products");
    } catch {
      toast(t("saveError"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="bg-stone/50 h-96 animate-pulse" />;
  }

  return (
    <div>
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="font-display text-navy text-3xl font-semibold">
            {isNew ? t("newProduct") : t("editProduct")}
          </h1>
          <p className="text-charcoal/50 mt-1 text-[13px]">
            {isNew ? t("addNewProduct") : t("updateProduct")}
          </p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          {t("save")}
        </Button>
      </div>

      {/* Language Tabs */}
      <div className="border-stone/60 flex gap-0 border-b">
        {(["he", "en"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setTab(lang)}
            className={`px-5 py-3 text-[13px] font-medium transition-colors ${
              tab === lang
                ? "border-navy text-navy border-b-2"
                : "text-charcoal/30 hover:text-charcoal/50"
            }`}
          >
            {lang === "he" ? t("hebrew") : t("english")}
          </button>
        ))}
      </div>

      <div className="mt-8 flex max-w-2xl flex-col gap-5">
        <div>
          <label className="text-charcoal/50 mb-1.5 block text-[12px] font-semibold tracking-[0.1em] uppercase">
            {t("titleLabel")} ({tab === "he" ? t("hebrew") : t("english")})
          </label>
          <Input
            value={form.title[tab]}
            onChange={(e) => updateLocaleField("title", tab, e.target.value)}
          />
        </div>

        <div>
          <label className="text-charcoal/50 mb-1.5 block text-[12px] font-semibold tracking-[0.1em] uppercase">
            {t("slugLabel")} ({tab})
          </label>
          <Input
            value={form.slug[tab]}
            onChange={(e) => updateLocaleField("slug", tab, e.target.value)}
          />
        </div>

        <div>
          <label className="text-charcoal/50 mb-1.5 block text-[12px] font-semibold tracking-[0.1em] uppercase">
            {t("descriptionLabel")} ({tab === "he" ? t("hebrew") : t("english")})
          </label>
          <Textarea
            value={form.description[tab]}
            onChange={(e) => updateLocaleField("description", tab, e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-charcoal/50 mb-1.5 block text-[12px] font-semibold tracking-[0.1em] uppercase">
              {t("priceLabel")}
            </label>
            <Input
              type="number"
              value={form.priceCents}
              onChange={(e) => updateField("priceCents", parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="text-charcoal/50 mb-1.5 block text-[12px] font-semibold tracking-[0.1em] uppercase">
              {t("comparePriceLabel")}
            </label>
            <Input
              type="number"
              value={form.comparePriceCents ?? ""}
              onChange={(e) =>
                updateField(
                  "comparePriceCents",
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>

        <div>
          <label className="text-charcoal/50 mb-1.5 block text-[12px] font-semibold tracking-[0.1em] uppercase">
            {t("skuLabel")}
          </label>
          <Input
            value={form.skuBase}
            onChange={(e) => updateField("skuBase", e.target.value)}
          />
        </div>

        <div>
          <label className="text-charcoal/50 mb-1.5 block text-[12px] font-semibold tracking-[0.1em] uppercase">
            {t("collectionsLabel")}
          </label>
          <Input
            value={form.collectionIds?.join(", ") ?? ""}
            onChange={(e) =>
              updateField(
                "collectionIds",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => updateField("isFeatured", e.target.checked)}
            className="accent-navy h-4 w-4"
          />
          <span className="text-navy text-[13px] font-medium">
            {t("featuredProduct")}
          </span>
        </label>
      </div>
    </div>
  );
}
