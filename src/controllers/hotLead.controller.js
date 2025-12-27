import { sendApprovedHotLeadEmail } from "../services/hot-email.service.js";

// TEMP: replace with DB later
const leadStore = new Map();

/* Approve button */
export async function approveHotLead(req, res) {
  const { leadId, token } = req.query;
  const lead = leadStore.get(leadId);

  if (!lead || lead.reviewToken !== token) {
    return res.status(403).send("Invalid or expired link");
  }

  await sendApprovedHotLeadEmail(lead, lead.aiDraft);
  lead.status = "SENT";

  res.send("✅ Email sent successfully");
}

/* Edit page */
export function renderEditPage(req, res) {
  const { leadId, token } = req.query;
  const lead = leadStore.get(leadId);

  if (!lead || lead.reviewToken !== token) {
    return res.status(403).send("Invalid or expired link");
  }

  res.send(`
    <form method="POST" action="/hot-lead/send">
      <input type="hidden" name="leadId" value="${leadId}" />

      <label>Subject</label>
      <input name="subject" value="${lead.aiDraft.subject}" />

      <label>Email Body</label>
      <textarea name="html" rows="12">${lead.aiDraft.html}</textarea>

      <button type="submit">Send Email</button>
    </form>
  `);
}

/* Send edited email */
export async function sendEditedEmail(req, res) {
  const { leadId, subject, html } = req.body;
  const lead = leadStore.get(leadId);

  if (!lead) return res.status(404).send("Lead not found");

  await sendApprovedHotLeadEmail(lead, { subject, html });
  lead.status = "SENT";

  res.send("✅ Edited email sent successfully");
}