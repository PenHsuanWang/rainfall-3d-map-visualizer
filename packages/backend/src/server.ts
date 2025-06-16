// backend/src/server.ts
import express from "express";
import cors from "cors";
import multer from "multer";
import { writeFile } from "node:fs/promises";
import { CsvDataProvider } from "./dataProviders/CsvDataProvider.js";
import { ApiDataProvider } from "./dataProviders/ApiDataProvider.js";
import { makeRainfallController } from "./controllers/rainfallController.js";

export function buildServer() {
  const app = express();
  app.use(cors());
  const upload = multer();
  const csvPath = process.env.CSV_FILE || "data/rainfall.csv";

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "no_file" });
    }
    try {
      await writeFile(csvPath, req.file.buffer);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "save_failed" });
    }
  });

  // choose provider via env
  const provider =
    process.env.DATA_SOURCE === "api"
      ? new ApiDataProvider(process.env.API_URL!)
      : new CsvDataProvider(csvPath);

  app.get("/api/rainfall", makeRainfallController(provider));
  return app;
}
