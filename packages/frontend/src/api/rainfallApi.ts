// frontend/src/api/rainfallApi.ts
import { RainfallDataPoint } from "@rain/common/src/types";

export async function getRainfallData(): Promise<RainfallDataPoint[]> {
  const res = await fetch("/api/rainfall");
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

export async function uploadCsv(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
}
