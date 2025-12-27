import { sendEmail } from "../services/email.service.js";
import { scheduleTask } from "../utils/scheduler.js";
import { analyzeLead } from "../services/ai.service.js";

export async function handleColdLead(lead) {
  lead.status = "EDUCATION";

  // Analyze lead to get AI insights
  const aiData = await analyzeLead(lead.message);

  // Send AI-generated email
  await sendEmail(lead.email, null, aiData);

  // Schedule follow-ups
  scheduleTask(async () => {
    const followUpData = await analyzeLead(lead.message + " follow-up newsletter");
    await sendEmail(lead.email, null, followUpData);
  }, 7 * 24 * 60 * 60 * 1000);

  scheduleTask(async () => {
    const followUpData = await analyzeLead(lead.message + " product update");
    await sendEmail(lead.email, null, followUpData);
  }, 30 * 24 * 60 * 60 * 1000);
}