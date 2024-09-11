import { filterVipsByStatus } from "~/server/utils";
import { Vip } from "~/server/utils/interfaces";

// Variables
let page = 1;
let count = 1;
let creditCardVip = 0;
let payPalVip = 0;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  if (!query.startDate || !query.endDate)
    return "provide startDate and endDate";

  // Initial
  const fetchInitialVip = async () => {
    const response = await $fetch(
      `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&status=ACTIVE&campaignCategory=1&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=200&page=${page}`
    ).then((data) => JSON.parse(data));

    if (response.result === "SUCCESS") {
      count = Math.ceil(response.message.totalResults / 200);
      const orders: Vip[] = response.message.data;
      const { creditCardVips, payPalVips } = await filterVipsByStatus(orders);
      creditCardVip += creditCardVips;
      payPalVip += payPalVips;
    }

    if (count > page) {
      page++;
      await fetchInitialVip();
    }

    return {
      totalInitialVip: response.message.totalResults,
      creditCardVip,
      payPalVip,
    };
  };

  // Declined
  const fetchDeclinedVip = async () => {
    const response = await $fetch(
      `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&dateRangeType=dateUpdated&campaignCategory=1&status=CANCELLED&startDate=${query.startDate}&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=1`
    ).then((data) => JSON.parse(data));
    return response.message.totalResults;
  };

  // RECYCLE_BILLING
  const fetchRecycleRebill = async () => {
    const response = await $fetch(
      `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignCategory=1&status=RECYCLE_BILLING&startDate=01/01/2010&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=1`
    ).then((data) => JSON.parse(data));
    return response.message.totalResults;
  };

  // Total-Vips
  const totalActiveVip = async () => {
    const response = await $fetch(
      `https://api.checkoutchamp.com/purchase/query/?loginId=${config.CC_LOGIN_ID}&password=${config.CC_PASSWORRD}&campaignCategory=1&status=ACTIVE&startDate=01/01/2010&endDate=${query.endDate}&startTime=03:00&endTime=02:59&resultsPerPage=1`
    ).then((data) => JSON.parse(data));
    return response.message.totalResults;
  };

  const vipInitial = await fetchInitialVip();
  const vipDeclined = await fetchDeclinedVip();
  const vipRecycleRebill = await fetchRecycleRebill();
  const vipTotal = await totalActiveVip();

  return { vipInitial, vipDeclined, vipRecycleRebill, vipTotal };
});
