import express from "express";
import leadRoutes from "./routes/leads.routes.js";
import hotLeadRoutes from "./routes/hotLeads.routes.js";

const app = express();

// REQUIRED for form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs
app.use("/api/leads", leadRoutes);

// HOT LEAD HUMAN FLOW
app.use("/hot-lead", hotLeadRoutes);

export default app;