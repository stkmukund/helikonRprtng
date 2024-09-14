export default defineEventHandler(async (event) => {
  // Variables
  let rebillRevenue = 0;
  let rebillApprovedPerc = 0;
  let rebillRefundRev = 0;
  let chargebackCnt = 0;
  let billableRebillRev = 0;
  let rebillRefundPerc = "0";
  
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";
  if (!query.id)
    return { result: "ERROR", message: "Provide id for campaignCategory" };

  const fetchOrders = async () => {
    const response = await $fetch(
      `https://api.checkoutchamp.com/transactions/summary/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&reportType=currency&productId=RECURRING&campaignCategory=${query.id}`
    ).then((data) => JSON.parse(data));

    if (response.result === "SUCCESS") {
      rebillRevenue = +response.message[0].rebillRev;
      rebillApprovedPerc = +response.message[0].rebillApprovedPerc;
      rebillRefundRev = +response.message[0].refundRev;
      chargebackCnt = +response.message[0].chargebackCnt;
      billableRebillRev = +(rebillRevenue - rebillRefundRev).toFixed(2);
      rebillRefundPerc = (rebillRefundRev / rebillRevenue).toFixed(4);
      if (rebillRefundPerc == "-Infinity") {
        rebillRefundPerc = "0";
      }

      return {
        rebillRevenue,
        rebillApprovedPerc: rebillApprovedPerc / 100,
        rebillRefundRev,
        billableRebillRev,
        rebillRefundPerc: +rebillRefundPerc,
        chargebackCnt,
      };
    } else {
      return { response };
    }
  };

  const response = await fetchOrders();

  return response;
});
