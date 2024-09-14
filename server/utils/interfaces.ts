export interface RequestOptions {
  method:
    | "POST"
    | "GET"
    | "HEAD"
    | "PATCH"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE";
  redirect: RequestRedirect;
  body?: string;
}

export interface Order {
  orderId: string;
  actualOrderId: number;
  externalOrderId: string;
  clientOrderId: string;
  shipCarrier: string;
  shipMethod: string | null;
  dateCreated: string;
  dateUpdated: string;
  orderType: string;
  orderStatus: string;
  reviewStatus: string | null;
  totalAmount: string;
  refundRemaining: string;
  avsResponse: string;
  cvvResponse: string;
  campaignName: string;
  customerId: number;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  shipFirstName: string;
  shipLastName: string;
  shipCompanyName: string | null;
  shipAddress1: string;
  shipAddress2: string | null;
  shipCity: string;
  shipState: string;
  shipCountry: string;
  shipPostalCode: string;
  paySource: string;
  cardType: string;
  cardLast4: string;
  cardExpiryDate: string;
  cardIsPrepaid: number;
  cardIsDebit: number;
  achRoutingNumber: string | null;
  achAccountNumber: string | null;
  couponCode: string;
  agentUserId: string | null;
  agentName: string | null;
  price: string;
  baseShipping: string;
  voiceLogNumber: string | null;
  discountPrice: string;
  salesTax: string;
  surcharge: string;
  shipUpcharge: string;
  shipProfileId: string | null;
  isDeclineSave: number;
  ipAddress: string;
  sourceId: string | null;
  sourceTitle: string | null;
  affId: string | null;
  sourceValue1: string | null;
  sourceValue2: string | null;
  sourceValue3: string | null;
  sourceValue4: string | null;
  sourceValue5: string | null;
  currencySymbol: string;
  currencyCode: string;
  campaignId: number;
  totalDiscount: string;
  productCost: string;
  shippingCost: string;
  custom1: string;
  custom2: string;
  custom3: string | null;
  custom4: string | null;
  custom5: string | null;
  UTMSource: string;
  UTMMedium: string;
  UTMCampaign: string;
  UTMTerm: string;
  UTMContent: string;
  funnelReferenceId: string;
  hasUpsell: boolean;
}

export interface Vip {
  status: string;
  transactions: [{ paySource: string }];
}

export interface orderSummaryResponse {
  totalAmount: number;
  initialSales: number;
  declined: number;
  declinePerc: number;
  partial: number;
  avgTicket: number;
  refundedAmount: number;
  frontendRefundPerc: number;
  creditCard: number;
  payPal: number;
}
export interface transactionSummaryResponse {
  rebillRevenue: number;
  rebillApprovedPerc: number;
  rebillRefundRev: number;
  billableRebillRev: number;
  rebillRefundPerc: number;
  chargebackCnt: number;
}
export interface salesContinuityResponse {
  vipInitial: {
    totalInitialVip: number;
    creditCardVip: number;
    payPalVip: number;
  };
  vipDeclined: number;
  vipRecycleRebill: number;
  vipTotal: number;
}
