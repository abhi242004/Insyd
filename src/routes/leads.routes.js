import { Router } from "express";
import { handleLead } from "../workflows/lead.workflow.js";

const router = Router();

router.post("/", async (req, res) => {
  const lead = await handleLead(req.body);
  res.status(201).json(lead);
});

export default router;
