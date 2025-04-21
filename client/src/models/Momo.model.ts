class MomoModel {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  shortLink: string;
  constructor(
    partnerCode: string,
    orderId: string,
    requestId: string,
    amount: number,
    responseTime: number,
    message: string,
    resultCode: number,
    payUrl: string,
    shortLink: string
  ) {
    this.partnerCode = partnerCode;
    this.orderId = orderId;
    this.requestId = requestId;
    this.amount = amount;
    this.responseTime = responseTime;
    this.message = message;
    this.resultCode = resultCode;
    this.payUrl = payUrl;
    this.shortLink = shortLink;
  }
  static initialize() {
    return {
      partnerCode: "",
      orderId: "",
      requestId: "",
      amount: 0,
      responseTime: 0,
      message: "",
      resultCode: 0,
      payUrl: "",
      shortLink: "",
    };
  }
}
export { MomoModel };
