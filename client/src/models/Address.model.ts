class AddressModel {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  phone: string;
  isDefault: boolean;
  constructor(
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    street: string,
    city: string,
    ward: string,
    district: string,
    phone: string,
    isDefault: boolean
  ) {
    this.id = id;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.street = street;
    this.ward = ward;
    this.district = district;
    this.city = city;
    this.phone = phone;
    this.isDefault = isDefault;
  }
  static initialize() {
    return {
      id: "",
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      phone: "",
      isDefault: false,
    };
  }
}
export { AddressModel };
