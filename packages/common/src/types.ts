// packages/common/src/types.ts
export interface RainfallDataPoint {
  lat: number;
  lon: number;
  /** rainfall in millimetres */
  value: number;
  /** ISO-8601 timestamp (optional) */
  timestamp?: string;
}
