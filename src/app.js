import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import leadRoutes from "./routes/leads.routes.js";
import hotLeadRoutes from "./routes/hotLeads.routes.js";

const app = express();

/* ---------------- Fix __dirname for ES Modules ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- Middleware ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- Frontend ---------------- */
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- APIs ---------------- */
app.use("/api/leads", leadRoutes);
app.use("/hot-lead", hotLeadRoutes);

/* ---------------- Health Check (Railway) ---------------- */
app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

export default app;
