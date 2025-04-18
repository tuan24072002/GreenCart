import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCartItem, updateCart } from "@/slice/cart/Cart.slice";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppContextProvider = ({ children }: { children: import("react").ReactNode }) => {
    const dispatch = useAppDispatch();
    const { list } = useAppSelector(state => state.product);
    const { cartItems } = useAppSelector(state => state.cart);
    const appState = useAppSelector(state => state.app);
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);

    //Add Product to Cart
    const addToCart = (itemId: string) => {
        const cartData = structuredClone(cartItems);
        if (cartData[itemId as keyof typeof cartData]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        dispatch(setCartItem(cartData));
        localStorage.setItem("cartItems", JSON.stringify(cartData));
        dispatch(updateCart({ cartItems: cartData }));
        toast.dismiss();
        toast.success("Added to Cart");
    }
    //Update cart item quantity
    const updateCartItem = (itemId: string, quantity: number) => {
        const cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        dispatch(setCartItem(cartData));
        localStorage.setItem("cartItems", JSON.stringify(cartData));
        dispatch(updateCart({ cartItems: cartData }));
        toast.dismiss();
        toast.success("Cart Updated");
    }
    const minusCartItem = (itemId: string) => {
        const cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        dispatch(setCartItem(cartData));
        localStorage.setItem("cartItems", JSON.stringify(cartData));
        dispatch(updateCart({ cartItems: cartData }));
        toast.dismiss();
        toast.success("Cart Updated");
    }
    //Remove Product from Cart
    const removeFromCart = (itemId: string) => {
        const cartData = structuredClone(cartItems);
        delete cartData[itemId];
        dispatch(setCartItem(cartData));
        localStorage.setItem("cartItems", JSON.stringify(cartData));
        dispatch(updateCart({ cartItems: cartData }));
        toast.dismiss();
        toast.success("Removed from Cart");
    }
    //Get Cart Count
    const getCartCount = () => {
        return Object.keys(cartItems).length;
    }
    //Get Cart Amount
    const getCartAmount = () => {
        let amount = 0;
        for (const item in cartItems) {
            const product = list.find((product) => product.id === item);
            if (product) {
                amount += product.offerPrice * cartItems[item];
            }
        }
        return Math.floor(amount * 100) / 100;
    }


    useEffect(() => {
        if (appState.user) {
            setCartItem(appState.user.cartItems);
        }
    }, [appState.user]);

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        currency,
        cartItems,
        addToCart,
        updateCartItem,
        minusCartItem,
        removeFromCart,
        getCartCount,
        getCartAmount,
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