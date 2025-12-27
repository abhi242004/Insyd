import { leadEvents } from "../events/lead.events.js";
import { handleHotLead } from "./hot.workflow.js";
import { handleWarmLead } from "./warm.workflow.js";
import { handleColdLead } from "./cold.workflow.js";

leadEvents.on("LEAD_CATEGORIZED", (lead) => {
  if (lead.category === "HOT") handleHotLead(lead);
  if (lead.category === "WARM") handleWarmLead(lead);
  if (lead.category === "COLD") handleColdLead(lead);
});