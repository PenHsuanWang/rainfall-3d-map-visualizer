// frontend/src/api/rainfallApi.ts
import { RainfallDataPoint } from "@rain/common/src/types";

export async function getRainfallData(): Promise<RainfallDataPoint[]> {
  const res = await fetch("/api/rainfall");
  if (!res.ok) throw new Error("Network error");
  return res.json();
}
