import type { RequestOptions } from "~/server/utils/interfaces";

// utils/index.ts
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const tableHead = [
  "Campaign Category",
  "Date",
  "Sales Total",
  "Initial Sales",
  "Declines",
  "Decline % of Initial Sales",
  "Partials",
  "AVG Ticket",
  "Rebill Revenue",
  "RB Approval %",
  "Rebill Refunds",
  "Billable Rebill Revenue",
  "Front end refunds",
  "Front end refund percentage refunded",
  "Rebill refund percentage refunded",
  "Chargebacks",
  "New VIPs",
  "VIP Cancellations",
  "CC New VIPs",
  "CC opt in to VIP",
  "CC initial Sales",
  "PP Initial Sales",
  "PP New VIPs",
  "PP opt in to VIP",
  "Total opt in between PP + CC",
  "Total VIP",
  "Recycle Billing",
];
