import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";
export const CartService = {
  async updateCart(data: any) {
    const res = await HttpService.doPostRequest(`cart/update`, data);
    return parseCommonHttpResult(res);
  },
};
