interface ProductType {
  _id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  quantity?: number;
  weight: string;
  image: string[];
  description: string[];
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
  rating: number;
}
interface AppContextType {
  navigate: ReturnType<typeof useNavigate>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
  showUserLogin: boolean;
  setShowUserLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setProducts: React.Dispatch<React.SetStateAction<ProductType[] | []>>;
  products: ProductType[];
  currency: string;
  cartItem: Record<string, number>;
  addToCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  getCartCount: () => number;
  getCartAmount: () => number;
}
interface AddressProps {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: number | string;
  country: string;
  phone: string;
}
interface OrderType {
  _id: string;
  userId: string;
  items: {
    _id: string;
    product: ProductType;
    quantity: number;
  }[];
  amount: number;
  address: AddressProps;
  status: string;
  paymentType: "COD" | "Online" | string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}
