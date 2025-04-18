import { AddressModel } from "@/models/Address.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";
export const AddressService = {
  listFromJson(data: any) {
    const list: AddressModel[] = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      list.push({
        id: element._id,
        userId: element.userId,
        firstName: element.firstName,
        lastName: element.lastName,
        email: element.email,
        street: element.street,
        ward: element.ward,
        district: element.district,
        city: element.city,
        phone: element.phone,
        isDefault: element.isDefault,
      });
    }
    return list;
  },
  itemFromJson(data: any) {
    const item = {
      id: data._id,
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      street: data.street,
      ward: data.ward,
      district: data.district,
      city: data.city,
      phone: data.phone,
      isDefault: data.isDefault,
    };
    return item;
  },
  async getAll(data: any) {
    const res = await HttpService.doGetRequest(`address/get`, data);
    return parseCommonHttpResult(res);
  },
  async addItem(data: any) {
    const res = await HttpService.doPostRequest(`address/add`, data);
    return parseCommonHttpResult(res);
  },
  async chooseDefaultAddress(data: any) {
    const res = await HttpService.doPutRequest(`address/default`, data);
    return parseCommonHttpResult(res);
  },
  async removeAddress(data: any) {
    const res = await HttpService.doDeleteRequest(`address/delete`, data);
    return parseCommonHttpResult(res);
  },
};
