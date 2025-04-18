import { AddressModel } from "./Address.model";
import { ProductModel } from "./Product.model";

type items = {
  product: ProductModel;
  quantity: number;
};

class OrderModel {
  id: string;
  userId: string;
  items: items[];
  amount: number;
  address: AddressModel;
  status: string;
  paymentType: "COD" | "Online";
  isPaid: boolean;
  createdAt: string;
  constructor(
    id: string,
    userId: string,
    items: items[],
    amount: number,
    address: AddressModel,
    status: string,
    paymentType: "COD" | "Online",
    isPaid: boolean,
    createdAt: string
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.amount = amount;
    this.address = address;
    this.status = status;
    this.paymentType = paymentType;
    this.isPaid = isPaid;
    this.createdAt = createdAt;
  }
  static initialize() {
    return {
      id: "",
      userId: "",
      items: [],
      amount: 0,
      address: AddressModel.initialize(),
      status: "",
      paymentType: "COD" as "COD" | "Online",
      isPaid: false,
      createdAt: "",
    };
  }
}

export { OrderModel };
