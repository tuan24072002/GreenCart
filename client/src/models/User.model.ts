class UserModel {
  id: string;
  name: string;
  email: string;
  isSeller: boolean;
  tokenSecretVersion: string;
  cartItems: { [key: string]: number };
  constructor(
    id: string,
    name: string,
    email: string,
    isSeller: boolean,
    tokenSecretVersion: string,
    cartItems: { [key: string]: number }
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isSeller = isSeller;
    this.tokenSecretVersion = tokenSecretVersion;
    this.cartItems = cartItems;
  }
  static initialize() {
    return {
      id: "",
      name: "",
      email: "",
      isSeller: false,
      tokenSecretVersion: "",
      cartItems: {},
    };
  }
}
export { UserModel };
