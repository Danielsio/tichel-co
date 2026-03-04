interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function storeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Tichel & Co.",
    description:
      "Luxury head coverings, tichels, and scarves for women who cover with intention.",
    url: "https://tichel.co",
    priceRange: "₪₪",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IL",
    },
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  slug: string;
  inStock: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `https://tichel.co/he/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: product.currency,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}
