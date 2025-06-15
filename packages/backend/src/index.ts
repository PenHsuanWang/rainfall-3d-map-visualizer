// backend/src/index.ts
import dotenv from "dotenv";
dotenv.config();
import { buildServer } from "./server.js";

const PORT = process.env.PORT || 3000;
buildServer().listen(PORT, () => console.log(`Backend running on :${PORT}`));
