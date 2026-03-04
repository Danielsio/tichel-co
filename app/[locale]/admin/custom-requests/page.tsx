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
      toast("Status updated", "success");
    } catch {
      toast("Failed to update", "error");
    }
  };

  return (
    <div>
      <h1 className="text-navy text-2xl font-semibold">Custom Requests</h1>

      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          <div className="text-charcoal/40 py-12 text-center">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-charcoal/40 py-12 text-center">
            No custom requests yet
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="border-stone rounded-sm border bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="sale">{req.type}</Badge>
                    <span className="text-charcoal/40 text-xs">
                      {req.createdAt
                        ? new Date(req.createdAt.seconds * 1000).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <p className="text-charcoal/80 mt-2 text-sm">{req.description}</p>
                  <div className="text-charcoal/50 mt-2 flex gap-4 text-xs">
                    <span>{req.contactEmail}</span>
                    <span>Budget: {req.budgetRange}</span>
                  </div>
                </div>
                <Select
                  value={req.status}
                  onChange={(e) =>
                    updateStatus(req.id, e.target.value as CustomRequestStatus)
                  }
                  className="w-44 text-xs"
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
