class UserModel {
  id: string;
  name: string;
  email: string;
  isSeller: boolean;
  tokenSecretVersion: string;
  cartItems: { [key: string]: number };
  googleId: string;
  facebookId: string;
  constructor(
    id: string,
    name: string,
    email: string,
    isSeller: boolean,
    tokenSecretVersion: string,
    cartItems: { [key: string]: number },
    googleId: string,
    facebookId: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isSeller = isSeller;
    this.tokenSecretVersion = tokenSecretVersion;
    this.cartItems = cartItems;
    this.googleId = googleId;
    this.facebookId = facebookId;
  }
  static initialize() {
    return {
      id: "",
      name: "",
      email: "",
      isSeller: false,
      tokenSecretVersion: "",
      cartItems: {},
      googleId: "",
      facebookId: "",
    };
  }
}
export { UserModel };
