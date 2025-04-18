class ProductModel {
  id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  weight: string;
  quantity?: number;
  image: string[];
  description: string[];
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
  rating: number;
  constructor(
    id: string,
    name: string,
    category: string,
    price: number,
    offerPrice: number,
    weight: string,
    quantity: number,
    image: string[],
    description: string[],
    createdAt: string,
    updatedAt: string,
    inStock: boolean,
    rating: number
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.offerPrice = offerPrice;
    this.weight = weight;
    this.quantity = quantity;
    this.image = image;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.inStock = inStock;
    this.rating = rating;
  }
  static initialize() {
    return {
      id: "",
      name: "",
      category: "",
      price: 0,
      offerPrice: 0,
      weight: "",
      quantity: 0,
      image: [""],
      description: [""],
      createdAt: "",
      updatedAt: "",
      inStock: false,
      rating: 0,
    };
  }
}
export { ProductModel };
