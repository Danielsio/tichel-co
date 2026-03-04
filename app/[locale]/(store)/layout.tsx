import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartSyncProvider } from "@/components/providers/cart-sync-provider";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartSyncProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </CartSyncProvider>
  );
}
