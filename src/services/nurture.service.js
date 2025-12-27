import { scheduleTask } from "../utils/scheduler.js";

export function startNurture(lead, educationalOnly = false) {
  console.log(`📩 Starting nurture for ${lead.category} lead`);

  if (educationalOnly) {
    scheduleTask(() => {
      console.log(`📘 Sending blog email to ${lead.email}`);
    }, 2000);
    return;
  }

  // Warm lead sequence
  scheduleTask(() => {
    console.log(`📨 Thank you email sent to ${lead.email}`);
  }, 1000);

  scheduleTask(() => {
    console.log(`📊 Case study sent to ${lead.email}`);
  }, 3000);

  scheduleTask(() => {
    console.log(`📞 Demo invite sent to ${lead.email}`);
  }, 5000);
}