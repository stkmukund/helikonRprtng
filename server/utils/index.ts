import { Order, RequestOptions, Vip } from "./interfaces";

export const campaignCategory = {
  1: {
    campaignId: [1, 2, 4, 5, 7, 8, 9, 13, 21],
    campaignProductId: [471, 1256, 518, 478],
    name: "mLab™",
  },
  12: {
    campaignId: [1, 68, 61, 47, 9, 6, 67, 69, 70],
    campaignProductId: [
      1011, 1030, 591, 610, 7, 463, 1177, 1196, 30, 1152, 1171, 1174, 1222,
    ],
    name: "Lash Cosmetics™",
  },
  13: {
    campaignId: [8, 45, 48, 88, 24, 20, 10, 28, 34, 35, 82, 83],
    campaignProductId: [
      2827, 2845, 2848, 612, 354, 101, 462, 1255, 160, 363, 432, 441, 569,
    ],
    name: "Brow Charm™",
  },
  15: {
    campaignId: [12, 46, 38, 85, 55, 21, 15, 71],
    campaignProductId: [572, 1655, 1673, 180, 1201, 716, 213, 1260, 1278],
    name: "Floral Secrets™",
  },
  16: {
    campaignId: [16, 53, 31, 19],
    campaignProductId: [257, 1202, 709, 286],
    name: "InvisiLift™",
  },
  21: {
    campaignId: [56, 58, 59],
    campaignProductId: [746, 1199, 930, 940],
    name: "Indestructible Tights™",
  },
  23: {
    campaignId: [72, 73, 75],
    campaignProductId: [1313, 1420, 1352],
    name: "MangoLift™",
  },
  25: {
    campaignId: [76, 81, 79],
    campaignProductId: [1435, 1522],
    name: "FitCharm™",
  },
  28: {
    campaignId: [97, 99, 101],
    campaignProductId: [3029, 3105, 3074],
    name: "BrowPro™",
  },
};

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
