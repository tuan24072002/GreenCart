class ZaloPayModel {
  returnCode: number;
  returnMessage: string;
  orderUrl: string;
  constructor(returnCode: number, returnMessage: string, orderUrl: string) {
    this.returnCode = returnCode;
    this.returnMessage = returnMessage;
    this.orderUrl = orderUrl;
  }
  static initialize() {
    return {
      returnCode: 0,
      returnMessage: "",
      orderUrl: "",
    };
  }
}
export { ZaloPayModel };
