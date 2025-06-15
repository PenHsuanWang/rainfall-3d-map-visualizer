import { createReadStream } from "node:fs";
import { parse } from "csv-parse";
import { RainfallDataPoint } from "@rain/common";
import { RainfallDataProvider } from "./DataProvider";

export class CsvDataProvider implements RainfallDataProvider {
  constructor(private csvPath: string) {}

  async fetchRainfallData(): Promise<RainfallDataPoint[]> {
    return new Promise<RainfallDataPoint[]>((resolve, reject) => {
      const result: RainfallDataPoint[] = [];
      createReadStream(this.csvPath)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on("data", (row) => {
          result.push({
            lat: Number(row.latitude),
            lon: Number(row.longitude),
            value: Number(row.rainfall_mm),
            timestamp: row.observation_ts || undefined,
          });
        })
        .on("end", () => resolve(result))
        .on("error", reject);
    });
  }
}