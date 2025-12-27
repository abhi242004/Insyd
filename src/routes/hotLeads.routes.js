import express from "express";
import {
  approveHotLead,
  renderEditPage,
  sendEditedEmail,
} from "../controllers/hotLead.controller.js";

const router = express.Router();

// Approve & send immediately
router.get("/hot-lead/approve", approveHotLead);

// Open edit page
router.get("/hot-lead/edit", renderEditPage);

// Send edited email
router.post("/hot-lead/send", sendEditedEmail);

export default router;