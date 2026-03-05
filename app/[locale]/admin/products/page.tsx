"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format-price";

interface ProductRow {
  id: string;
  title: { he: string; en: string };
  slug: { he: string; en: string };
  priceCents: number;
  isFeatured: boolean;
  publishedAt: unknown;
  collectionIds: string[];
}

export default function AdminProductsPage() {
  const t = useTranslations("admin");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ProductRow));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-display text-navy text-3xl font-semibold">
            {t("products")}
          </h1>
          <p className="text-charcoal/50 mt-1 text-[13px]">{t("manageCatalog")}</p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">{t("addProduct")}</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-stone/60 border-b">
              <th className="text-charcoal/50 pe-4 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("product")}
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("price")}
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("status")}
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("collections")}
              </th>
              <th className="text-charcoal/50 pb-3 text-start text-[11px] font-semibold tracking-[0.1em] uppercase">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-charcoal/30 py-16 text-center">
                  {t("loading")}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-charcoal/30 py-16 text-center">
                  {t("noProducts")}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-stone/60 border-b transition-colors hover:bg-white/50"
                >
                  <td className="py-3.5 pe-4">
                    <p className="text-navy text-[13px] font-medium">
                      {product.title.he}
                    </p>
                    <p className="text-charcoal/30 mt-0.5 text-[11px]">
                      {product.title.en}
                    </p>
                  </td>
                  <td className="text-navy py-3.5 pe-4 text-[13px] font-medium">
                    {formatPrice(product.priceCents)}
                  </td>
                  <td className="py-3.5 pe-4">
                    <div className="flex gap-1.5">
                      {product.publishedAt ? (
                        <Badge variant="success">{t("published")}</Badge>
                      ) : (
                        <Badge variant="outOfStock">{t("draft")}</Badge>
                      )}
                      {product.isFeatured && (
                        <Badge variant="sale">{t("featured")}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="text-charcoal/50 py-3.5 pe-4 text-[12px]">
                    {product.collectionIds?.join(", ") ?? "—"}
                  </td>
                  <td className="py-3.5">
                    <Link
                      href={`/admin/products/${product.id}` as never}
                      className="text-navy text-[12px] font-medium hover:underline"
                    >
                      {t("edit")}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
