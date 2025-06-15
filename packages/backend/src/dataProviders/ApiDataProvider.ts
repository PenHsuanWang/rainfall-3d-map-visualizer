
import { RainfallDataPoint } from "@rain/common";
import { RainfallDataProvider } from "./DataProvider";

export class ApiDataProvider implements RainfallDataProvider {
  constructor(private url: string) {}
  async fetchRainfallData(): Promise<RainfallDataPoint[]> {
    const res = await fetch(this.url); // uses the Node global fetch
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }
}