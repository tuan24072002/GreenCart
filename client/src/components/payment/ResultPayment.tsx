import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Success from "./Success";
import Failed from "./Failed";
import { useAppDispatch } from "@/app/hooks";
import { setCartItem } from "@/slice/cart/Cart.slice";

const ResultPayment = () => {
    const dispatch = useAppDispatch();
    const { navigate } = useAppContext();
    const location = useLocation();
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

    //VNPay
    const orderIdVNPay = queryParams.get('orderId');
    const statusVNPay = queryParams.get('status');

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
        } else if (paymentMethod === "vnpay") {
            if (!orderIdVNPay || !statusVNPay || !amount) {
                navigate("/");
            } else {
                dispatch(setCartItem({}));
                localStorage.removeItem("cartItems");
            }
        }
    }, [amount, dispatch, message, navigate, orderIdMomo, orderIdVNPay, orderIdZaloPay, orderInfo, orderType, partnerCode, paymentMethod, responseTime, resultCode, statusVNPay, statusZaloPay])

    return (
        (paymentMethod === "momo" && Number(resultCode) === 0) ||
            (paymentMethod === "zalopay" && Number(statusZaloPay) === 1) ||
            (paymentMethod === "vnpay" && Number(statusVNPay) === 0) ?
            <Success
                orderId={(paymentMethod === "momo" ? orderIdMomo : paymentMethod === "zalopay" ? orderIdZaloPay : orderIdVNPay) || ""}
                amount={amount || ""}
                orderType={paymentMethod === "momo" ? "Momo wallet" : paymentMethod === "zalopay" ? "ZaloPay" : paymentMethod === "vnpay" ? "VNPay" : ""}
            /> :
            <Failed
                orderId={(paymentMethod === "momo" ? orderIdMomo : paymentMethod === "zalopay" ? orderIdZaloPay : orderIdVNPay) || ""}
                amount={amount || ""}
                orderType={paymentMethod === "momo" ? "Momo wallet" : paymentMethod === "zalopay" ? "ZaloPay" : paymentMethod === "vnpay" ? "VNPay" : ""}
            />
    )
}

export default ResultPayment