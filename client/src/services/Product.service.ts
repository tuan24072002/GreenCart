import { ProductModel } from "@/models/Product.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonHttpResult";
export const ProductService = {
  listFromJson(data: any) {
    const list: ProductModel[] = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      list.push({
        id: element._id,
        name: element.name,
        category: element.category,
        price: element.price,
        offerPrice: element.offerPrice,
        weight: element.weight,
        image: element.image,
        description: element.description,
        createdAt: element.createdAt,
        updatedAt: element.updatedAt,
        inStock: element.inStock,
        rating: element.rating,
      });
    }
    return list;
  },
  itemFromJson(data: any) {
    const item = {
      id: data._id,
      name: data.name,
      category: data.category,
      price: data.price,
      offerPrice: data.offerPrice,
      weight: data.weight,
      image: data.image,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      inStock: data.inStock,
      rating: data.rating,
    };
    return item;
  },
  async getAll(data: any) {
    const res = await HttpService.doGetRequest(`product/list`, data);
    return parseCommonHttpResult(res);
  },
  async getById(data: any) {
    const res = await HttpService.doGetRequest(`product/${data?.id}`, data);
    return parseCommonHttpResult(res);
  },
  async addItem(data: any) {
    const res = await HttpService.doUploadRequest(`product/add`, data?.data);
    return parseCommonHttpResult(res);
  },
  async changeStock(data: any) {
    const res = await HttpService.doPutRequest(`product/stock`, data);
    return parseCommonHttpResult(res);
  },
  //   async deleteItem(data: any) {
  //     const res = await HttpService.doDeleteRequest(
  //       `/categories/${data?.id}`,
  //       data?.data
  //     );
  //     return parseCommonHttpResult(res);
  //   },
  //   async editItem(data: any) {
  //     const response = await HttpService.doPatchRequest(
  //       `/categories/${data?.id}`,
  //       data?.data
  //     );
  //     return parseCommonHttpResult(response);
  //   },
};
