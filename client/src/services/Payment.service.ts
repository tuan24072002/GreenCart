import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";

export const PaymentService = {
  itemMomoFromJson(data: any) {
    const item = {
      partnerCode: data.partnerCode,
      orderId: data.orderId,
      requestId: data.requestId,
      amount: data.amount,
      responseTime: data.responseTime,
      message: data.message,
      resultCode: data.resultCode,
      payUrl: data.payUrl,
      shortLink: data.shortLink,
    };
    return item;
  },
  itemZaloPayFromJson(data: any) {
    const item = {
      returnCode: data.return_code,
      returnMessage: data.return_message,
      orderUrl: data.order_url,
    };
    return item;
  },
  itemVNPayFromJson(data: any) {
    const item = {
      vnpUrl: data.vnpUrl,
    };
    return item;
  },
  async paymentMomo(data: any) {
    const res = await HttpService.doPostRequest(`payment/momo`, data);
    return parseCommonHttpResult(res);
  },
  async checkTransMomo(data: any) {
    const res = await HttpService.doPostRequest(
      `payment/momo/check-trans`,
      data
    );
    return parseCommonHttpResult(res);
  },
  async paymentZaloPay(data: any) {
    const res = await HttpService.doPostRequest(`payment/zalopay`, data);
    return parseCommonHttpResult(res);
  },
  async paymentVNPay(data: any) {
    const res = await HttpService.doGetRequest(`payment/vnpay`, data);
    return parseCommonHttpResult(res);
  },
};
