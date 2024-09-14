import { Order, RequestOptions, Vip } from "./interfaces";

export const campaignCategory = [
  { name: "mLab™", id: 1, campaignId: "1,2,4,5,7,8,9,13,21" },
  { name: "CheckoutChamp", id: 2, campaignId: "6,20" },
  { name: "Flexi Health™", id: 3, campaignId: "11" },
  { name: "Bank Sites", id: 4, campaignId: "14,15,16,17,18" },
];

export const requestOptions: RequestOptions = {
  method: "POST",
  redirect: "follow",
};

export const filterOrdersByStatus = async (orders: Order[]) => {
  let ordersComplete: Order[] = [];
  let ordersRefunded: Order[] = [];
  let ordersCancelled: Order[] = [];
  let ordersDeclined: Order[] = [];
  let ordersPartial: Order[] = [];
  let totalOrderAmount = 0;
  let refundedOrderAmount = 0;
  let creditCardOrders = 0;
  let payPalOrders = 0;
  orders.map((order) => {
    if (order.orderStatus === "COMPLETE") {
      totalOrderAmount += +order.totalAmount;
      ordersComplete.push(order);
      if (order.paySource === "CREDITCARD") {
        creditCardOrders++;
      }
      if (order.paySource === "PAYPAL") {
        payPalOrders++;
      }
    }
    if (order.orderStatus === "REFUNDED") {
      totalOrderAmount += +order.totalAmount;
      ordersRefunded.push(order);
      refundedOrderAmount += +order.totalAmount;
      if (order.paySource === "CREDITCARD") {
        creditCardOrders++;
      }
      if (order.paySource === "PAYPAL") {
        payPalOrders++;
      }
    }
    if (order.orderStatus === "CANCELLED") {
      totalOrderAmount += +order.totalAmount;
      ordersCancelled.push(order);
      if (order.paySource === "CREDITCARD") {
        creditCardOrders++;
      }
      if (order.paySource === "PAYPAL") {
        payPalOrders++;
      }
    }
    if (order.orderStatus === "DECLINED") {
      ordersDeclined.push(order);
    }
    if (order.orderStatus === "PARTIAL") {
      ordersPartial.push(order);
    }
  });

  return {
    ordersDeclined: ordersDeclined.length,
    ordersPartial: ordersPartial.length,
    totalOrderAmount,
    refundedOrderAmount,
    creditCardOrders,
    payPalOrders,
    initialOrder:
      ordersComplete.length + ordersRefunded.length + ordersCancelled.length,
  };
};

export const filterVipsByStatus = async (orders: Vip[]) => {
  let creditCardVips = 0;
  let payPalVips = 0;
  orders.map((order) => {
    if (order.transactions[0].paySource === "CREDITCARD") {
      creditCardVips++;
    }
    if (order.transactions[0].paySource === "PAYPAL") {
      payPalVips++;
    }
  });

  return {
    creditCardVips,
    payPalVips,
  };
};

export const getCampaignIdById = (id: number) => {
  // Find the category with the matching id
  const category = campaignCategory.find((item) => item.id === id);

  // If found, return the campaignId; otherwise, return null or an appropriate message
  return category ? category.campaignId : null;
};

export const updateSheet = async (item, type = "daily") => {
  if (type === "front") return item;

  const requestOptions = {
    method: "POST",
    redirect: "follow",
    body: JSON.stringify(item),
  };

  const response = await $fetch(`/api/google-api/?type=${type}`, requestOptions)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });

  return ["Sheet updated successfully", item, response.data];
};
