import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryConstraint,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./client";

export function getCollection(path: string) {
  return collection(db, path);
}

export function getDocument(path: string, id: string) {
  return doc(db, path, id);
}

export async function fetchDoc<T = DocumentData>(path: string, id: string) {
  const snap = await getDoc(doc(db, path, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T & { id: string };
}

export async function fetchCollection<T = DocumentData>(
  path: string,
  ...constraints: QueryConstraint[]
) {
  const q = query(collection(db, path), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T & { id: string });
}

export {
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
};
