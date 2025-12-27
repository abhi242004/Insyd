import { leads } from "../db/store.js";
import { randomUUID } from "crypto";

export function saveLead(data) {
  const lead = {
    id: randomUUID(),
    createdAt: new Date(),
    ...data,
  };

  leads.push(lead);
  return lead;
}