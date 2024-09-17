import { filterOrdersByStatus } from "~/server/utils";
import { Order } from "~/server/utils/interfaces";

export default defineEventHandler(async (event) => {
  // Variables
  let page = 1;
  let count = 1;
  let totalAmount: number = 0;
  let refundedAmount: number = 0;
  let creditCard: number = 0;
  let payPal: number = 0;
  let initialSales: number = 0;
  let declined: number = 0;
  let partial: number = 0;

  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";
  if (!query.id)
    return { result: "ERROR", message: "Provide id for campaignCategory" };

  query.id = getCampaignIdById(+query.id);

  const fetchOrders = async () => {
    try {
      const response = await $fetch(
        `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignId=${query.id}&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
      ).then((data) => JSON.parse(data));

      if (response.result === "ERROR") {
        throw new Error(response.message);
      }

      if (response.result === "SUCCESS") {
        count = Math.ceil(response.message.totalResults / 200);
        console.log(page);
        
        const orders: Order[] = response.message.data;
        const {
          ordersDeclined,
          ordersPartial,
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
        declined += ordersDeclined;
        partial += ordersPartial;

        //   return completedOrders;
      }

      if (count > page) {
        page++;
        await fetchOrders();
      }

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
    } catch (error) {
      return { result: "ERROR", message: error.message };
    }
  };

  const response = await fetchOrders();

  return response;
});
