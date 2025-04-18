interface ThemeContextType {
  theme: string;
  setTheme: (theme: "light" | "dark") => void;
}
interface AppContextType {
  navigate: ReturnType<typeof useNavigate>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
  showUserLogin: boolean;
  setShowUserLogin: React.Dispatch<React.SetStateAction<boolean>>;
  currency: string;
  cartItems: Record<string, number>;
  addToCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  minusCartItem: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  getCartCount: () => number;
  getCartAmount: () => number;
}
interface ProductType {
  id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  quantity?: number;
  weight: string;
  image: string[];
  description: string | string[];
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
  rating: number;
}
interface AddressProps {
  id: string;
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
type actions =
  | "ALL"
  | "VIE"
  | "INS"
  | "UPD"
  | "DEL"
  | "UND"
  | "IMP"
  | "UNV"
  | "VER"
  | "WAI"
  | "CAN"
  | "DEN"
  | "PDF"
  | "APP"
  | "EXC"
  | "MSP"
  | "MBP"
  | "MWA"
  | "MSV"
  | "MDC"
  | "MRB"
  | "MRS"
  | "MCO"
  | "ISY"
  | "MPN"
  | "MGT"
  | "MCT"
  | "MPT"
  | "MSU"
  | "MWE"
  | "MST"
  | "MSW"
  | "VCP"
  | "MCP"
  | "MFP"
  | "MEW"
  | "MEH"
  | "MEN"
  | "MTA"
  | "MPI"
  | "VQT"
  | "VVL"
  | "MDA"
  | "MCU"
  | "MCN"
  | "MOD"
  | "MCI"
  | "MPH"
  | "MPV"
  | "MDT"
  | "MWD"
  | "MAD"
  | "MTG"
  | "MWH"
  | "MVA"
  | "MNO"
  | "DVE"
  | "CVE"
  | "WLQ"
  | "DLQ"
  | "LIQ"
  | "CLQ"
  | "DRE"
  | "RED"
  | "CRE"
  | "MDL"
  | "MDR"
  | "VTA"
  | "MTD"
  | "MDD"
  | "VBR"
  | "VSR"
  | "VPTP"
  | "VGP"
  | "VTP"
  | "VRP";

type AuthProps = {
  name?: string;
  email: string;
  password: string;
};
interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  description: string;
}
type ChartType =
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "candlestick"
  | "boxPlot"
  | "radar"
  | "polarArea"
  | "rangeBar"
  | "rangeArea"
  | "treemap"
  | undefined;
type filterChartType = "year" | "day" | "hour" | "minute" | "second" | "month";
interface GraphDataProps {
  categories: string[];
  series: string[];
}
type ApexChartProps = {
  options: any;
  series: any;
  type: ChartType;
  height: number | string;
};
type ApexProps = {
  options: any;
  series: any;
};
