import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Success from "./Success";
import Failed from "./Failed";
import { useAppDispatch } from "@/app/hooks";
import { setCartItem } from "@/slice/cart/Cart.slice";

const ResultPayment = () => {
    const dispatch = useAppDispatch();
    const { navigate } = useAppContext();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const orderId = queryParams.get('orderId')?.split("-")[0];
    const amount = queryParams.get('amount');
    const message = queryParams.get('message');
    const partnerCode = queryParams.get('partnerCode');
    const orderInfo = queryParams.get('orderInfo');
    const orderType = queryParams.get('orderType');
    const resultCode = queryParams.get('resultCode');
    const responseTime = queryParams.get('responseTime');

    useEffect(() => {
        if (!orderId || !message || !partnerCode || !orderInfo || !orderType || !resultCode || !responseTime) {
            navigate("/");
        } else {
            const now = Date.now();
            const diff = now - parseInt(responseTime);
            const diffMinutes = diff / (1000 * 60);
            if (diffMinutes > 1) {
                navigate("/");
            } else if (Number(resultCode) === 0) {
                dispatch(setCartItem({}));
                localStorage.removeItem("cartItems");
            }
        }
    }, [dispatch, message, navigate, orderId, orderInfo, orderType, partnerCode, responseTime, resultCode])

    return (
        Number(resultCode) === 0 ?
            <Success
                orderId={orderId || ""}
                amount={amount || ""}
                orderType={orderType || ""}
            /> :
            <Failed
                orderId={orderId || ""}
                amount={amount || ""}
                orderType={orderType || ""}
            />
    )
}

export default ResultPayment