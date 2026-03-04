"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import type { CustomRequestStatus } from "@/types";

interface RequestRow {
  id: string;
  contactEmail: string;
  type: string;
  description: string;
  budgetRange: string;
  status: CustomRequestStatus;
  createdAt: { seconds: number } | null;
}

const STATUS_OPTIONS: CustomRequestStatus[] = [
  "submitted",
  "under_review",
  "quote_sent",
  "quote_accepted",
  "in_production",
  "shipped",
  "completed",
  "cancelled",
];

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      const q = query(collection(db, "customRequests"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as RequestRow));
      setLoading(false);
    }
    load();
  }, []);

  const updateStatus = async (id: string, status: CustomRequestStatus) => {
    try {
      await updateDoc(doc(db, "customRequests", id), { status });
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast("הסטטוס עודכן", "success");
    } catch {
      toast("שגיאה בעדכון", "error");
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-navy text-3xl font-semibold">בקשות מיוחדות</h1>
        <p className="text-charcoal/40 mt-1 text-[13px]">
          ניהול בקשות הזמנה מותאמות אישית
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-charcoal/30 py-16 text-center">טוען...</div>
        ) : requests.length === 0 ? (
          <div className="text-charcoal/30 py-16 text-center">
            אין בקשות מיוחדות עדיין
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="border-stone/60 border bg-white p-6 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="default">{req.type}</Badge>
                    <span className="text-charcoal/30 text-[11px]">
                      {req.createdAt
                        ? new Date(req.createdAt.seconds * 1000).toLocaleDateString(
                            "he-IL",
                          )
                        : "—"}
                    </span>
                  </div>
                  <p className="text-charcoal/70 mt-3 text-[13px] leading-relaxed">
                    {req.description}
                  </p>
                  <div className="text-charcoal/40 mt-3 flex gap-5 text-[11px] tracking-wide">
                    <span>{req.contactEmail}</span>
                    <span className="text-charcoal/20">|</span>
                    <span>תקציב: {req.budgetRange}</span>
                  </div>
                </div>
                <Select
                  value={req.status}
                  onChange={(e) =>
                    updateStatus(req.id, e.target.value as CustomRequestStatus)
                  }
                  className="w-44 text-[12px]"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
