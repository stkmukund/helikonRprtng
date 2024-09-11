import { filterOrdersByStatus } from "~/server/utils";
import { Order } from "~/server/utils/interfaces";

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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  const fetchOrders = async () => {
    const response = await $fetch(
      `https://api.checkoutchamp.com/order/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignCategory=1&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=200&orderType=NEW_SALE&page=${page}`
    ).then((data) => JSON.parse(data));

    if (response.result === "SUCCESS") {
      count = Math.ceil(response.message.totalResults / 200);
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

    return "All Done";
  };

  await fetchOrders();

  let declinePerc = (declined / (initialSales + declined)).toFixed(4);
  if (declinePerc == "NaN") declinePerc = "0";

  let avgTicket = (+totalAmount / initialSales).toFixed(2);
  if (avgTicket == "NaN" || avgTicket == "Infinity") avgTicket = "0";

  return {
    totalAmount: +totalAmount.toFixed(2),
    initialSales,
    declined,
    declinePerc: +declinePerc,
    partial,
    avgTicket: +avgTicket,
    refundedAmount: +refundedAmount.toFixed(2),
    creditCard,
    payPal,
  };
});
