import { PaymentModel } from "@/models/Payment.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";
export const PaymentService = {
  itemFromJson(data: PaymentModel) {
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
};
