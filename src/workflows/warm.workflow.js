import { sendEmail } from "../services/email.service.js";
import { scheduleTask } from "../utils/scheduler.js";
import { leadEvents } from "../events/lead.events.js";

export function handleWarmLead(lead) {
  lead.status = "NURTURING";

  sendEmail(lead.email, "welcome");
  
  scheduleTask(() => {
    sendEmail(lead.email, "case_study");
  }, 2 * 24 * 60 * 60 * 1000);

  scheduleTask(() => {
    sendEmail(lead.email, "demo_offer");
  }, 5 * 24 * 60 * 60 * 1000);

  // Re-evaluate engagement
  scheduleTask(() => {
    if (lead.openedEmails >= 2) {
      lead.category = "HOT";
      leadEvents.emit("LEAD_CATEGORIZED", lead);
    } else {
      lead.status = "COLD";
    }
  }, 7 * 24 * 60 * 60 * 1000);
}