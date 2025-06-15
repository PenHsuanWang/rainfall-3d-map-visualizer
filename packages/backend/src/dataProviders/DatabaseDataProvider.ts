import { RainfallDataPoint } from "@rain/common";
import { RainfallDataProvider } from "./DataProvider";

// Stub for future DB support
export class DatabaseDataProvider implements RainfallDataProvider {
  async fetchRainfallData(): Promise<RainfallDataPoint[]> {
    // Connect/query your database here...
    return [];
  }
}