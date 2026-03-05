import type { Timestamp } from "firebase/firestore";

export type Locale = "he" | "en";

export type LocaleMap = {
  he: string;
  en: string;
};

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code: string } };

export type OrderStatus =
  | "pending_payment"
  | "payment_confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type CustomRequestStatus =
  | "submitted"
  | "under_review"
  | "quote_sent"
  | "quote_accepted"
  | "in_production"
  | "shipped"
  | "completed"
  | "cancelled";

export type UserRole = "customer" | "admin";

export type DiscountType = "percent" | "fixed" | "free_shipping";

export interface FirestoreUser {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  locale: Locale;
  loyaltyPoints: number;
  createdAt: Timestamp;
}

export interface FirestoreProduct {
  slug: LocaleMap;
  title: LocaleMap;
  description: LocaleMap;
  priceCents: number;
  comparePriceCents?: number;
  collectionIds: string[];
  skuBase: string;
  isFeatured: boolean;
  isNew: boolean;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
}

export interface FirestoreVariant {
  sku: string;
  color: LocaleMap;
  fabric: LocaleMap;
  size?: string;
  stockQty: number;
  imageUrls: string[];
}

export interface FirestoreCollection {
  slug: LocaleMap;
  title: LocaleMap;
  description: LocaleMap;
  imageUrl: string;
  displayOrder: number;
  publishedAt: Timestamp | null;
}

export interface StoreProduct {
  id: string;
  slug: string;
  title: LocaleMap;
  description: LocaleMap;
  priceCents: number;
  comparePriceCents?: number;
  collectionIds: string[];
  isFeatured: boolean;
  isNew: boolean;
  variants: StoreVariant[];
}

export interface StoreVariant {
  id: string;
  sku: string;
  color: LocaleMap;
  fabric: LocaleMap;
  size?: string;
  stockQty: number;
  imageUrls: string[];
}

export interface StoreCollection {
  id: string;
  slug: string;
  title: LocaleMap;
  description: LocaleMap;
  imageUrl: string;
  displayOrder: number;
}

export interface FirestoreOrder {
  userId?: string;
  guestEmail?: string;
  status: OrderStatus;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  stripePaymentIntentId: string;
  shippingAddress: Address | null;
  items: OrderItem[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderItem {
  variantId: string;
  productId: string;
  productTitle: string;
  variantLabel: string;
  imageUrl: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Address {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface FirestoreCustomRequest {
  userId?: string;
  contactEmail: string;
  type: string;
  description: string;
  budgetRange: string;
  referenceImageUrls: string[];
  status: CustomRequestStatus;
  assignedTo?: string;
  createdAt: Timestamp;
}

export interface FirestoreReview {
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title: string;
  body: string;
  imageUrls: string[];
  verifiedPurchase: boolean;
  publishedAt: Timestamp | null;
}

export interface CartItem {
  variantId: string;
  productId: string;
  productTitle: string;
  variantLabel: string;
  imageUrl: string;
  quantity: number;
  unitPriceCents: number;
}

export interface FirestoreDiscountCode {
  type: DiscountType;
  value: number;
  minOrderCents: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: Timestamp;
}
