import { requestOptions } from "~/server/utils";
import {
  orderSummaryResponse,
  salesContinuityResponse,
  transactionSummaryResponse,
} from "~/server/utils/interfaces";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // For Daily Report
  if (!query.startDate || !query.endDate) {
    query.startDate = "09/09/2024";
    query.endDate = "09/10/2024";
  }

  const orders = await $fetch<orderSummaryResponse>(
    `/reports/customers/order-summary/?startDate=${query.startDate}&endDate=${query.endDate}`,
    requestOptions
  );
  const transaction = await $fetch<transactionSummaryResponse>(
    `/reports/payments/transaction-summary/?startDate=${query.startDate}&endDate=${query.endDate}`,
    requestOptions
  );
  const sales = await $fetch<salesContinuityResponse>(
    `/reports/sales/continuity/?startDate=${query.startDate}&endDate=${query.endDate}`,
    requestOptions
  );

  return {
    hello: "world",
    orders,
    transaction,
    sales,
  };
});
