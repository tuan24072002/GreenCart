class VNPayModel {
  vnpUrl: string;
  constructor(vnpUrl: string) {
    this.vnpUrl = vnpUrl;
  }
  static initialize() {
    return {
      vnpUrl: "",
    };
  }
}
export { VNPayModel };
