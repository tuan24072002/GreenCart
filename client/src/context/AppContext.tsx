import { dummyProducts } from "@/assets/assets";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: import("react").ReactNode }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState(true);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState<ProductType[] | []>([]);
    const [cartItem, setCartItem] = useState<Record<string, number>>({});
    const [searchQuery, setSearchQuery] = useState("");

    //fetch all product
    const fetchProducts = async () => {
        setProducts(dummyProducts);
    }

    //Add Product to Cart
    const addToCart = (itemId: string) => {
        const cartData = structuredClone(cartItem);
        if (cartData[itemId as keyof typeof cartData]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItem(cartData);
        toast.dismiss();
        toast.success("Added to Cart");
    }
    //Update cart item quantity
    const updateCartItem = (itemId: string, quantity: number) => {
        const cartData = structuredClone(cartItem);
        cartData[itemId] = quantity;
        setCartItem(cartData);
        toast.dismiss();
        toast.success("Cart Updated");
    }
    //Remove Product from Cart
    const removeFromCart = (itemId: string) => {
        const cartData = structuredClone(cartItem);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        setCartItem(cartData);
        toast.dismiss();
        toast.success("Removed from Cart");
    }
    //Get Cart Count
    const getCartCount = () => {
        let count = 0;
        for (const item in cartItem) {
            count += cartItem[item];
        }
        return count;
    }
    //Get Cart Amount
    const getCartAmount = () => {
        let amount = 0;
        for (const item in cartItem) {
            const product = products.find((product) => product._id === item);
            if (product) {
                amount += product.offerPrice * cartItem[item];
            }
        }
        return Math.floor(amount * 100) / 100;
    }
    useEffect(() => {
        fetchProducts();
    }, [])
    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        setProducts,
        products,
        currency,
        cartItem,
        addToCart,
        updateCartItem,
        removeFromCart,
        searchQuery,
        setSearchQuery,
        getCartCount,
        getCartAmount
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
}