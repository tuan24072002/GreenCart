import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Success from "./Success";
import Failed from "./Failed";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCartItem } from "@/slice/cart/Cart.slice";

const ResultPayment = () => {
    const dispatch = useAppDispatch();
    const { navigate } = useAppContext();
    const location = useLocation();
    const paymentState = useAppSelector(state => state.payment);
    const { paymentMethod } = useParams();
    const queryParams = new URLSearchParams(location.search);
    //Momo
    const orderIdMomo = queryParams.get('orderId')?.split("_")[1];
    const amount = queryParams.get('amount');
    const message = queryParams.get('message');
    const partnerCode = queryParams.get('partnerCode');
    const orderInfo = queryParams.get('orderInfo');
    const orderType = queryParams.get('orderType');
    const resultCode = queryParams.get('resultCode');
    const responseTime = queryParams.get('responseTime');
    //ZaloPay
    const orderIdZaloPay = queryParams.get('apptransid')?.split("_")[1];
    const statusZaloPay = queryParams.get('status');

    useEffect(() => {
        if (paymentMethod === "momo") {
            if (!orderIdMomo || !message || !partnerCode || !orderInfo || !orderType || !resultCode || !responseTime) {
                navigate("/");
            } else {
                dispatch(setCartItem({}));
                localStorage.removeItem("cartItems");
            }
        } else if (paymentMethod === "zalopay") {
            if (!orderIdZaloPay || !statusZaloPay || !amount) {
                navigate("/");
            } else {
                dispatch(setCartItem({}));
                localStorage.removeItem("cartItems");
            }
        }
    }, [amount, dispatch, message, navigate, orderIdMomo, orderIdZaloPay, orderInfo, orderType, partnerCode, paymentMethod, paymentState.selectedMethod, responseTime, resultCode, statusZaloPay])

    return (
        (paymentMethod === "momo" && Number(resultCode) === 0) ||
            (paymentMethod === "zalopay" && Number(statusZaloPay) === 1) ?
            <Success
                orderId={(paymentMethod === "momo" ? orderIdMomo : orderIdZaloPay) || ""}
                amount={amount || ""}
                orderType={paymentMethod === "momo" ? "Momo wallet" : paymentMethod === "zalopay" ? "ZaloPay" : ""}
            /> :
            <Failed
                orderId={(paymentMethod === "momo" ? orderIdMomo : orderIdZaloPay) || ""}
                amount={amount || ""}
                orderType={paymentMethod === "momo" ? "Momo wallet" : paymentMethod === "zalopay" ? "ZaloPay" : ""}
            />
    )
}

export default ResultPayment