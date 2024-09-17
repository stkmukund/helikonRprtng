import { filterOrdersByStatus } from "~/server/utils";
import { Order } from "~/server/utils/interfaces";

export default defineEventHandler(async (event) => {
  // Variables
  let page = 1;
  let count = 1;
  let totalAmount: number = 0;
  let refundedAmount: number = 0;
  let creditCard = 0;
  let payPal = 0;
  let totalOrders: any = [];
  let initialSales = 0;

  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";
  if (!query.id)
    return { result: "ERROR", message: "Provide id for campaignCategory" };

  query.id = getCampaignIdById(+query.id);

  // Complete
  const fetchComplete = async () => {
    try {
      const response = await $fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&orderStatus=COMPLETE&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
      ).then((data) => JSON.parse(data));

      if (response.result === "ERROR") {
        throw new Error(response.message);
      }

      if (response.result === "SUCCESS") {
        totalOrders.push(response.message.data);
      }

      if (response.message.totalResults > 200) {
        count = Math.ceil(response.message.totalResults / 200);
      }

      if (count > page) {
        page++;
        await fetchComplete();
      }

      page = 1;

      return totalAmount;
    } catch (error) {}
  };

  // Refunded
  const fetchRefunded = async () => {
    try {
      const response = await $fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&orderStatus=REFUNDED&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
      ).then((data) => JSON.parse(data));

      if (response.result === "ERROR") {
        throw new Error(response.message);
      }

      if (response.result === "SUCCESS") {
        totalOrders.push(response.message.data);
      }
      if (response.message.totalResults > 200) {
        count = Math.ceil(response.message.totalResults / 200);
      }

      if (count > page) {
        page++;
        await fetchRefunded();
      }

      page = 1;

      return totalAmount;
    } catch (error) {}
  };

  // Cancelled
  const fetchCancelled = async () => {
    try {
      const response = await $fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&orderStatus=CANCELLED&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
      ).then((data) => JSON.parse(data));

      if (response.result === "ERROR") {
        throw new Error(response.message);
      }

      if (response.result === "SUCCESS") {
        totalOrders.push(response.message.data);
      }

      if (response.message.totalResults > 200) {
        count = Math.ceil(response.message.totalResults / 200);
      }

      if (count > page) {
        page++;
        await fetchCancelled();
      }

      page = 1;

      return totalAmount;
    } catch (error) {}
  };

  // DECLINED
  const fetchDeclined = async () => {
    const data = await $fetch(
      `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&orderStatus=DECLINED&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=1&orderType=NEW_SALE&page=${page}`
    ).then((data) => JSON.parse(data));
    return data.message.totalResults;
  };

  // PARTIAL
  const fetchPartial = async () => {
    const data = await $fetch(
      `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&orderStatus=PARTIAL&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=1&orderType=NEW_SALE&page=${page}`
    ).then((data) => JSON.parse(data));
    return data.message.totalResults;
  };

  await fetchComplete();
  await fetchRefunded();
  await fetchCancelled();
  const declined = await fetchDeclined();
  const partial = await fetchPartial();

  await totalOrders.map(async (orders) => {
    const {
      totalOrderAmount,
      refundedOrderAmount,
      creditCardOrders,
      payPalOrders,
      initialOrder,
    } = await filterOrdersByStatus(orders);
    totalAmount += totalOrderAmount;
    refundedAmount += refundedOrderAmount;
    initialSales += initialOrder;
    creditCard += creditCardOrders;
    payPal += payPalOrders;
  });

  let declinePerc = (declined / (initialSales + declined)).toFixed(4);
  if (declinePerc == "NaN") declinePerc = "0";

  let avgTicket = (+totalAmount / initialSales).toFixed(2);
  if (avgTicket == "NaN" || avgTicket == "Infinity") avgTicket = "0";

  let frontendRefundPerc = (refundedAmount / totalAmount).toFixed(4);
  if (frontendRefundPerc == "NaN") frontendRefundPerc = "0";

  return {
    totalAmount: +totalAmount.toFixed(2),
    initialSales,
    declined,
    declinePerc: +declinePerc,
    partial,
    avgTicket: +avgTicket,
    refundedAmount: +refundedAmount.toFixed(2),
    frontendRefundPerc: +frontendRefundPerc,
    creditCard,
    payPal,
  };
});
