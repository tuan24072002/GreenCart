import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";
export const UserService = {
  itemFromJson(data: any) {
    const item = {
      id: data.id,
      name: data.name,
      email: data.email,
      isSeller: data.isSeller,
      tokenSecretVersion: data.tokenSecretVersion,
      cartItems: data.cartItems,
      googleId: data.googleId,
      facebookId: data.facebookId,
    };
    return item;
  },
  async updateUser(data: any) {
    const res = await HttpService.doPutRequest(`user/update`, data);
    return parseCommonHttpResult(res);
  },
  async changePassword(data: any) {
    const res = await HttpService.doPutRequest("user/change-password", data);
    return parseCommonHttpResult(res);
  },
};
