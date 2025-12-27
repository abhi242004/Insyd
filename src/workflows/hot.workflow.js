import { notifySales } from "../services/human.service.js";
import { sendHotLeadEmailForReview } from "../services/hot-email.service.js";

export function handleHotLead(lead) {
  lead.status = "HUMAN_REVIEW";

  // Notify sales and include AI reasoning
  notifySales({
    leadId: lead.id,
    email: lead.email,
    message: lead.message,
    aiReasoning: lead.ai.reasoning
  });

  // Send AI-generated draft to reviewer for approval
  sendHotLeadEmailForReview(lead, "abhinavprasad2004ap@gmail.com");

  // SLA escalation
  setTimeout(() => {
    if (lead.status === "HUMAN_REVIEW") {
      console.log("⏰ SLA Missed – escalating HOT lead");
    }
  }, 15 * 60 * 1000);
}
