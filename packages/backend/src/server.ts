// backend/src/server.ts
import express from "express";
import cors from "cors";
import { CsvDataProvider } from "./dataProviders/CsvDataProvider.js";
import { ApiDataProvider } from "./dataProviders/ApiDataProvider.js";
import { makeRainfallController } from "./controllers/rainfallController.js";

export function buildServer() {
  const app = express();
  app.use(cors());

  // choose provider via env
  const provider =
    process.env.DATA_SOURCE === "api"
      ? new ApiDataProvider(process.env.API_URL!)
      : new CsvDataProvider(process.env.CSV_FILE || "data/rainfall.csv");

  app.get("/api/rainfall", makeRainfallController(provider));
  return app;
}
