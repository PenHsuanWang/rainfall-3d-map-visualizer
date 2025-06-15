// backend/src/controllers/rainfallController.ts
import { Request, Response } from "express";
import { RainfallDataProvider } from "../dataProviders/DataProvider.js";

export const makeRainfallController =
  (provider: RainfallDataProvider) => async (req: Request, res: Response) => {
    try {
      const data = await provider.fetchRainfallData();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "failed_to_fetch_data" });
    }
  };
