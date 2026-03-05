"use client";

import { useEffect, useRef } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/hooks/use-auth";

/**
 * Syncs the Zustand cart with Firestore for authenticated users.
 * - On login: merges local items with remote cart
 * - On change: writes local cart to Firestore
 * - On logout: keeps local cart as-is
 */
export function useCartSync() {
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const skipNextWrite = useRef(false);
  const initialSynced = useRef(false);

  // Listen to remote cart on login
  useEffect(() => {
    if (!user) {
      initialSynced.current = false;
      return;
    }

    const cartRef = doc(db, "cart", user.uid);
    const unsubscribe = onSnapshot(cartRef, (snap) => {
      if (!initialSynced.current && snap.exists()) {
        const remoteItems = snap.data()?.items ?? [];
        // Merge remote items into local cart (local wins for conflicts)
        for (const remoteItem of remoteItems) {
          const exists = useCartStore
            .getState()
            .items.find((i) => i.variantId === remoteItem.variantId);
          if (!exists) {
            skipNextWrite.current = true;
            addItem(remoteItem);
          }
        }
      }
      initialSynced.current = true;
    });

    return () => unsubscribe();
  }, [user, addItem]);

  // Write local cart to Firestore on change (debounced)
  useEffect(() => {
    if (!user || !initialSynced.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const cartRef = doc(db, "cart", user.uid);
      setDoc(cartRef, { items, updatedAt: serverTimestamp() }).catch(() => {
        // Silently fail — local cart still works
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [user, items]);
}
