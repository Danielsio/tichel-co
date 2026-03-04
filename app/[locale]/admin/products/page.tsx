"use client";

import { useEffect, useState } from "react";
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
      <div className="flex items-center justify-between">
        <h1 className="text-navy text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm">+ Add Product</Button>
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-stone border-b text-start">
              <th className="text-charcoal/50 pe-4 pb-3 text-xs font-semibold uppercase">
                Product
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-xs font-semibold uppercase">
                Price
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-xs font-semibold uppercase">
                Status
              </th>
              <th className="text-charcoal/50 pe-4 pb-3 text-xs font-semibold uppercase">
                Collections
              </th>
              <th className="text-charcoal/50 pb-3 text-xs font-semibold uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-charcoal/40 py-12 text-center">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-charcoal/40 py-12 text-center">
                  No products yet
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-stone border-b">
                  <td className="py-3 pe-4">
                    <div>
                      <p className="text-navy text-sm font-medium">
                        {product.title.en}
                      </p>
                      <p className="text-charcoal/40 text-xs">{product.title.he}</p>
                    </div>
                  </td>
                  <td className="text-navy py-3 pe-4 text-sm font-medium">
                    {formatPrice(product.priceCents)}
                  </td>
                  <td className="py-3 pe-4">
                    <div className="flex gap-1">
                      {product.publishedAt ? (
                        <Badge variant="new">Published</Badge>
                      ) : (
                        <Badge variant="outOfStock">Draft</Badge>
                      )}
                      {product.isFeatured && <Badge variant="sale">Featured</Badge>}
                    </div>
                  </td>
                  <td className="text-charcoal/50 py-3 pe-4 text-xs">
                    {product.collectionIds?.join(", ") ?? "—"}
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/admin/products/${product.id}` as never}
                      className="text-gold text-xs font-medium hover:underline"
                    >
                      Edit
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
