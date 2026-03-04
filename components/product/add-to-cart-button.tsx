"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  variantId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  stockQty: number;
}

export function AddToCartButton({
  variantId,
  productId,
  name,
  price,
  image,
  color,
  size,
  stockQty,
}: AddToCartButtonProps) {
  const t = useTranslations("product");
  const tCart = useTranslations("cart");
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const isOutOfStock = stockQty <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    setIsAdding(true);

    addItem({
      variantId,
      productId,
      name,
      price,
      quantity: 1,
      image,
      color,
      size,
    });

    toast(tCart("addedToCart", { name }), "success");
    openCart();

    setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <Button
      size="lg"
      fullWidth
      onClick={handleAdd}
      isLoading={isAdding}
      disabled={isOutOfStock}
    >
      {isOutOfStock ? t("outOfStock") : t("addToBag")}
    </Button>
  );
}
