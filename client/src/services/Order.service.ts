import { OrderModel } from "@/models/Order.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";
export const OrderService = {
  listFromJson(data: any) {
    const list: OrderModel[] = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      list.push({
        id: element._id,
        userId: element.userId,
        items: element.items,
        amount: element.amount,
        address: element.address,
        status: element.status,
        paymentType: element.paymentType,
        isPaid: element.isPaid,
        createdAt: element.createdAt,
      });
    }
    return list;
  },
  itemFromJson(data: any) {
    const item = {
      id: data._id,
      userId: data.userId,
      items: data.items,
      amount: data.amount,
      address: data.address,
      status: data.status,
      paymentType: data.paymentType,
      isPaid: data.isPaid,
      createdAt: data.createdAt,
    };
    return item;
  },
  async placeOrderCOD(data: any) {
    const res = await HttpService.doPostRequest(`order/cod`, data);
    return parseCommonHttpResult(res);
  },
  async placeOrderOnline(data: any) {
    const res = await HttpService.doPostRequest(`order/online`, data);
    return parseCommonHttpResult(res);
  },
  async getUserOrders(data: any) {
    const res = await HttpService.doGetRequest(`order/user`, data);
    return parseCommonHttpResult(res);
  },
  async getAllOrders(data: any) {
    const res = await HttpService.doGetRequest(`order/seller`, data);
    return parseCommonHttpResult(res);
  },
};
