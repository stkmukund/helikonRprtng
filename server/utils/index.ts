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
  });

  return {
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

export const updateSheet = async (item, type) => {
  const secretKey = "darkAngle";
  let testData = convertToStringArray(item);
  let encrytData = customEncryptArray(testData, secretKey);
  let decryptData = customDecryptArray(encrytData, secretKey);

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

export const getReportDates = (query: {
  startDate?: string;
  endDate?: string;
  type?: string;
}) => {
  if (query.type !== "daily") {
    if (query.type === "front") return false;
    const response: { startDate: string; endDate: string } = getStartAndEndDate(
      query.type
    );
    query.startDate = response.startDate;
    query.endDate = response.endDate;
    return 1;
  }
  // Get current date and yesterday's date
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  // Set startDate as yesterday and endDate as today if not provided
  if (!query.startDate) {
    query.startDate = formatDate(yesterday);
  }
  if (!query.endDate) {
    query.endDate = formatDate(currentDate);
  }
};

const getStartAndEndDate = (
  type: string
): { startDate: string; endDate: string } | null => {
  const today = new Date();
  const isFirstDayOfMonth = today.getDate() === 1;

  const formatDate = (date: Date): string => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  if (type === "monthly") {
    // Check if today is the 1st day of the month
    if (!isFirstDayOfMonth) {
      // Handle January case: go to December of the previous year
      const startDate =
        today.getMonth() === 0
          ? new Date(today.getFullYear() - 1, 11, 1) // 1st December of the previous year
          : new Date(today.getFullYear(), today.getMonth() - 1, 1); // 1st day of the previous month;

      // End date: 1st day of the current month
      const endDate = new Date(today.getFullYear(), today.getMonth(), 1);

      return { startDate: formatDate(startDate), endDate: formatDate(endDate) };
    } else {
      // If today is not the 1st of the month, return null
      return null;
    }
  } else if (type === "quarterly") {
    const month = today.getMonth(); // Current month (0-based, so Jan = 0)
    const quarterStartMonth = Math.floor(month / 3) * 3; // Start of the current quarter

    // Check if today is the 1st day of the quarter
    const isFirstDayOfQuarter = isFirstDayOfMonth && month % 3 === 0;

    if (!isFirstDayOfQuarter) {
      // Special case for January: previous quarter is October - December of the previous year
      if (month === 0) {
        const startDate = new Date(today.getFullYear() - 1, 9, 1); // 1st October of the previous year
        const endDate = new Date(today.getFullYear(), 0, 1); // 1st January of the current year

        return {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        };
      }

      // Otherwise, calculate previous quarter
      const startDate = new Date(
        today.getFullYear(),
        quarterStartMonth - 3, // Previous quarter start month
        1
      );

      // End date: 1st day of the current quarter
      const endDate = new Date(today.getFullYear(), quarterStartMonth, 1);

      return { startDate: formatDate(startDate), endDate: formatDate(endDate) };
    } else {
      // If today is not the 1st of the quarter, return null
      return null;
    }
  }

  // Default response when type doesn't match
  return null;
};

// Function to format date as MM/DD/YYYY
const formatDate = (date: Date): string => {
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Get month, pad with leading zero if necessary
  const dd = String(date.getDate()).padStart(2, "0"); // Get day, pad with leading zero if necessary
  const yyyy = date.getFullYear(); // Get full year
  return `${mm}/${dd}/${yyyy}`;
};

function customEncryptArray(
  message: (string | number)[],
  key: string
): string[] {
  return message.map((item) => {
    const str = item.toString(); // Convert the item to a string if it's not already
    let encrypted = "";
    for (let i = 0; i < str.length; i++) {
      encrypted += String.fromCharCode(
        str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }

    // Encode the XOR result to Base64 for safe transmission
    // Convert the encrypted string to a Uint8Array first
    const binaryString = unescape(encodeURIComponent(encrypted)); // Encode as UTF-8
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // Convert Uint8Array to Base64 string
    const base64String = btoa(String.fromCharCode.apply(null, bytes));
    return base64String;
  });
}

export const customDecryptArray = (
  encryptedArray: string[],
  key: string
): (string | number)[] => {
  return encryptedArray.map((encryptedItem) => {
    // Decode the Base64 encoded string first
    const decodedMessage = atob(encryptedItem);
    let decrypted = "";
    for (let i = 0; i < decodedMessage.length; i++) {
      decrypted += String.fromCharCode(
        decodedMessage.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return decrypted;
  });
};

function convertToStringArray(mixedArray: (string | number)[]) {
  let stringArray: (string | number)[] = [];
  mixedArray.map((item) => {
    stringArray.push(item.toString());
  });

  return stringArray;
}
