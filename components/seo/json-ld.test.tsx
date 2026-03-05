import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd, storeJsonLd, productJsonLd } from "@/components/seo/json-ld";

describe("JsonLd", () => {
  it("renders a script tag with JSON content", () => {
    const data = { "@type": "Test", name: "Test Name" };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(script?.textContent).toBe(JSON.stringify(data));
  });
});

describe("storeJsonLd", () => {
  it("returns correct schema structure", () => {
    const schema = storeJsonLd();

    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Store",
      name: "Tichel & Co.",
      description: "כיסויי ראש יוקרתיים, טישלים וצעיפים לנשים שמכסות בכוונה.",
      url: "https://tichel.co",
      priceRange: "₪₪",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IL",
      },
    });
  });
});

describe("productJsonLd", () => {
  it("returns correct schema with InStock", () => {
    const product = {
      name: "Test Product",
      description: "Test description",
      price: 19900,
      currency: "ILS",
      slug: "test-product",
      inStock: true,
    };

    const schema = productJsonLd(product);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Product");
    expect(schema.name).toBe("Test Product");
    expect(schema.description).toBe("Test description");
    expect(schema.url).toBe("https://tichel.co/products/test-product");
    expect(schema.offers["@type"]).toBe("Offer");
    expect(schema.offers.price).toBe("199.00");
    expect(schema.offers.priceCurrency).toBe("ILS");
    expect(schema.offers.availability).toBe("https://schema.org/InStock");
  });

  it("returns correct schema with OutOfStock", () => {
    const product = {
      name: "Out of Stock Product",
      description: "Out of stock",
      price: 5000,
      currency: "ILS",
      slug: "out-of-stock",
      inStock: false,
    };

    const schema = productJsonLd(product);

    expect(schema.offers.availability).toBe("https://schema.org/OutOfStock");
    expect(schema.offers.price).toBe("50.00");
  });
});
