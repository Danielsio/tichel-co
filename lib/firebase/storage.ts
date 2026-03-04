import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./client";

export async function uploadFile(path: string, file: File | Blob) {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function deleteFile(path: string) {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
}

export function getFileUrl(path: string) {
  return getDownloadURL(ref(storage, path));
}
