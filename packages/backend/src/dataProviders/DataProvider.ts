import { RainfallDataPoint } from "@rain/common/src/types.js";
export interface RainfallDataProvider {
  fetchRainfallData(): Promise<RainfallDataPoint[]>;
}