import { requestOptions } from "~/server/utils";
import {
  orderSummaryResponse,
  salesContinuityResponse,
  transactionSummaryResponse,
} from "~/server/utils/interfaces";

const campaignCategoryId = campaignCategory[3];

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // startDate and endDate
  getReportDates(query);

  const orders = await $fetch<orderSummaryResponse>(
    `/reports/customers/order-summary/?startDate=${query.startDate}&endDate=${query.endDate}&id=${campaignCategoryId.id}`,
    requestOptions
  );
  const transaction = await $fetch<transactionSummaryResponse>(
    `/reports/payments/transaction-summary/?startDate=${query.startDate}&endDate=${query.endDate}&id=${campaignCategoryId.id}`,
    requestOptions
  );
  const sales = await $fetch<salesContinuityResponse>(
    `/reports/sales/continuity/?startDate=${query.startDate}&endDate=${query.endDate}&id=${campaignCategoryId.id}`,
    requestOptions
  );

  let CCoptVip = (sales.vipInitial.creditCardVip / orders.creditCard).toFixed(
    4
  );
  if (CCoptVip == "NaN") CCoptVip = "0";
  let PPoptVip = (sales.vipInitial.payPalVip / orders.payPal).toFixed(4);
  if (PPoptVip == "NaN") PPoptVip = "0";
  let TotaloptPPCC = (
    sales.vipInitial.totalInitialVip / orders.initialSales
  ).toFixed(4);
  if (TotaloptPPCC == "NaN") TotaloptPPCC = "0";

  // Update in google sheet
  const item = [
    campaignCategoryId?.name,
    query.startDate,
    orders.totalAmount || 0,
    orders.initialSales || 0,
    orders.declined || 0,
    orders.declinePerc || 0,
    orders.partial || 0,
    orders.avgTicket || 0,
    transaction.rebillRevenue || 0,
    (transaction.rebillApprovedPerc || 0) / 100,
    transaction.rebillRefundRev || 0,
    transaction.billableRebillRev || 0,
    orders.refundedAmount || 0,
    orders.frontendRefundPerc || 0,
    transaction.rebillRefundPerc || 0,
    transaction.chargebackCnt || 0,
    sales.vipInitial.totalInitialVip || 0,
    sales.vipDeclined || 0,
    sales.vipInitial.creditCardVip || 0,
    Number(CCoptVip) || 0,
    orders.creditCard || 0,
    orders.payPal || 0,
    sales.vipInitial.payPalVip || 0,
    Number(PPoptVip) || 0,
    Number(TotaloptPPCC) || 0,
    sales.vipTotal || 0,
    sales.vipRecycleRebill || 0,
  ];

  try {
    let response = await updateSheet(item, query.type);
    return response;
  } catch (error) {
    return ["Error updating sheet:", error];
  }
});
