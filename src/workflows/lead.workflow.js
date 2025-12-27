import { analyzeLead } from "../services/ai.service.js";
import { saveLead } from "../services/lead.service.js";
import { leadEvents } from "../events/lead.events.js";

export async function handleLead(payload) {
  const lead = saveLead({
    ...payload,
    status: "NEW",
    openedEmails: 0
  });

  const ai = await analyzeLead(payload.message);

  lead.ai = ai;
  lead.status = "ANALYZED";

  if (ai.lead_score >= 80) lead.category = "HOT";
  else if (ai.lead_score >= 50) lead.category = "WARM";
  else lead.category = "COLD";

  lead.status = "CATEGORIZED";

  leadEvents.emit("LEAD_CATEGORIZED", lead);

  return lead;
}