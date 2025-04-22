import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { assets } from "@/assets/assets";
import CheckoutOnline from "@/components/payment/CheckoutOnline";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext"
import { chooseDefaultAddress, getAllAddress, removeAddress, resetActionState, selectItem } from "@/slice/address/Address.slice";
import { setCartItem, updateCart } from "@/slice/cart/Cart.slice";
import { placeOrderCOD, resetActionStateOrder } from "@/slice/order/Order.slice";
import { paymentMomo, paymentVNPay, paymentZaloPay, resetActionStatePayment, setPaymentOption, setShowCheckoutOnline } from "@/slice/payment/Payment.slice";
import { fetchAll } from "@/slice/product/Product.slice";
import { setShowUserLogin } from "@/slice/auth/Auth.slice";
import { processing } from "@/utils/alert";
import { Flag, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";


const Cart = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const addressState = useAppSelector(state => state.address);
    const paymentState = useAppSelector(state => state.payment);
    const orderState = useAppSelector(state => state.order);
    const appState = useAppSelector(state => state.app);
    const productState = useAppSelector(state => state.product);
    const { currency, cartItems, removeFromCart, minusCartItem, getCartCount, addToCart, getCartAmount, navigate } = useAppContext();
    const [cartArr, setCartArr] = useState<ProductType[]>([]);
    const [showAddress, setShowAddress] = useState(false);

    const getCart = useCallback(() => {
        const tempArr = [];
        for (const key in cartItems) {
            const product = productState.list.find((product) => product.id === key);
            if (product) {
                const productCopy = structuredClone(product);
                productCopy.quantity = cartItems[key];
                tempArr.push(productCopy);
            }
        }

        setCartArr(tempArr);
    }, [cartItems, productState.list])

    const placeOrder = async () => {
        try {
            if (paymentState.paymentOption === "COD") {
                const payload = {
                    items: cartArr.map((item) => ({
                        product: item.id,
                        quantity: item.quantity
                    })),
                    address: addressState.item.id
                }
                await dispatch(placeOrderCOD(payload));
            } else {
                dispatch(setShowCheckoutOnline(true));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        switch (orderState.statusAction) {
            case "failed":
                toast.error(orderState.error ?? "");
                dispatch(resetActionStateOrder());
                break;
            case "loading":
                processing("Processing", true);
                break;
            case "completed":
                if (paymentState.paymentOption === "COD") {
                    toast.success(orderState.success ?? "");
                    navigate("/my-orders");
                    dispatch(updateCart({ cartItems: {} }));
                    dispatch(setCartItem({}));
                    localStorage.removeItem("cartItems");
                    dispatch(resetActionStateOrder());
                } else {
                    const payload = {
                        orderId: orderState.item.id,
                        amount: orderState.item.amount,
                        lang: appState.language
                    }
                    toast.success(orderState.success ?? "");
                    if (paymentState.selectedMethod === "momo") {
                        dispatch(paymentMomo(payload));
                    } else if (paymentState.selectedMethod === "zalopay") {
                        dispatch(paymentZaloPay(payload));
                    } else if (paymentState.selectedMethod === "vnpay") {
                        dispatch(paymentVNPay(payload));
                    }
                    dispatch(updateCart({ cartItems: {} }));
                    dispatch(setCartItem({}));
                    localStorage.removeItem("cartItems");
                    dispatch(resetActionStateOrder());
                }
                break;
        }
    }, [appState.language, dispatch, navigate, orderState.error, orderState.item.amount, orderState.item.id, orderState.statusAction, orderState.success, paymentState.paymentOption, paymentState.selectedMethod])
    useEffect(() => {
        switch (paymentState.statusAction) {
            case "failed":
                toast.error(paymentState.error ?? "");
                dispatch(resetActionStatePayment());
                break;
            case "loading":
                processing("Processing", true);
                break;
            case "completed":
                if (paymentState.selectedMethod === "momo" && paymentState.itemMomo.resultCode === 0) {
                    window.location.href = paymentState.itemMomo.payUrl;
                } else if (paymentState.selectedMethod === "zalopay" && paymentState.itemZaloPay.returnCode === 1) {
                    window.location.href = paymentState.itemZaloPay.orderUrl;
                } else if (paymentState.selectedMethod === "vnpay" && paymentState.itemVNPay.vnpUrl) {
                    window.location.href = paymentState.itemVNPay.vnpUrl;
                }
                dispatch(resetActionStatePayment());
                break;
        }
    }, [dispatch, paymentState.error, paymentState.itemMomo.payUrl, paymentState.itemMomo.resultCode, paymentState.itemVNPay.vnpUrl, paymentState.itemZaloPay.orderUrl, paymentState.itemZaloPay.returnCode, paymentState.selectedMethod, paymentState.statusAction])

    useEffect(() => {
        switch (addressState.statusAction) {
            case "failed":
                toast.error(addressState.error ?? "");
                dispatch(resetActionState());
                break;
            case "loading":
                processing("Processing", false);
                break;
            case "completed":
                toast.success(addressState.success ?? "");
                dispatch(getAllAddress())
                dispatch(resetActionState());
                break;
        }
    }, [dispatch, addressState])
    useEffect(() => {
        if (productState.list.length > 0 && cartItems) getCart();
    }, [productState.list, cartItems, getCart])
    useEffect(() => {
        if (appState.logined) {
            dispatch(fetchAll({ showAll: true }));
            dispatch(getAllAddress())
        }
    }, [appState.logined, dispatch])
    return (
        <>
            {
                (productState.list || []).length > 0 && cartItems ?
                    <div className="flex flex-col lg:flex-row gap-4 py-16 max-w-7xl w-full px-6 mx-auto">
                        <div className='flex-1 max-w-4xl lg:mb-0 mb-10'>
                            <h1 className="text-3xl font-medium mb-6">
                                {t(`cart.title`)} <span className="text-sm text-primary">{getCartCount()} {t(`cart.items`)}</span>
                            </h1>

                            <div className="grid grid-cols-[2fr_1fr_1fr] text-accent-foreground text-base font-medium pb-3">
                                <p className="text-left">{t(`cart.details`)}</p>
                                <p className="text-center">{t(`cart.subtotal`)}</p>
                                <p className="text-center">{t(`cart.action`)}</p>
                            </div>

                            <div className="w-full max-h-[calc(100vh-365px)] overflow-x-hidden overscroll-y-auto">
                                {cartArr.map((product, index) => (
                                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-muted-foreground items-center text-sm md:text-base font-medium pt-3">
                                        <div className="flex items-center md:gap-6 gap-3">
                                            <div
                                                onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product.id}`)}
                                                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                                <img className="max-w-full h-full object-cover" src={import.meta.env.VITE_BACKEND_URL + product.image[0].slice(1)} alt={product.name} />
                                            </div>
                                            <div>
                                                <p className="hidden md:block font-semibold">{product.name}</p>
                                                <div className="font-normal text-muted-foreground/70 flex flex-col gap-2">
                                                    <p>{t(`cart.weight`)}: <span>{product.weight || "N/A"}</span></p>
                                                    <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/10 rounded select-none">
                                                        <button onClick={() => minusCartItem(product.id)} className="cursor-pointer text-md px-2 h-full" >
                                                            -
                                                        </button>
                                                        <span className="w-5 text-center">{cartItems[product.id]}</span>
                                                        <button onClick={() => addToCart(product.id)} className="cursor-pointer text-md px-2 h-full" >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-center">{Number(product.offerPrice * (product.quantity || 1)).toLocaleString()}{currency}</p>
                                        <button onClick={() => removeFromCart(product.id)} className="cursor-pointer mx-auto">
                                            <img src={assets.remove_icon} alt="Remove" className="inline-block size-6" />
                                        </button>
                                    </div>)
                                )}
                            </div>

                            <button onClick={() => navigate("/products")} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                                <img src={assets.arrow_right_icon_colored} alt="Arrow" className="group-hover:-translate-x-1 transition" />
                                {t(`cart.continueShopping`)}
                            </button>
                        </div>

                        <div className="lg:max-w-sm w-full h-fit shadow bg-background p-5 max-md:mt-16 border border-gray-300/70 rounded-md overflow-hidden">
                            <h2 className="text-xl md:text-xl font-medium">{t(`cart.summary`)}</h2>
                            <hr className="border-gray-300 my-5" />

                            <div className="mb-6">
                                <p className="text-sm font-medium uppercase">{t(`cart.address`)}</p>
                                <div className="relative flex items-start gap-2 mt-2">
                                    <p className="text-muted-foreground line-clamp-2 text-sm flex-1">{
                                        (addressState.item && addressState.item.street && addressState.item.ward && addressState.item.district && addressState.item.city) ? `${addressState.item.street}, ${addressState.item.ward}, ${addressState.item.district}, ${addressState.item.city}` : "No address found"
                                    }</p>
                                    <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer w-fit">
                                        {t(`cart.change`)}
                                    </button>
                                    {showAddress && (() => {
                                        const addresses = addressState.list || [];
                                        const defaultAddress = addresses.find(address => address.isDefault);
                                        const nonDefaultAddresses = addresses.filter(address => !address.isDefault);

                                        return (
                                            <div className="absolute top-12 border border-gray-300 text-sm w-full rounded-md bg-background overflow-hidden">
                                                {defaultAddress && (
                                                    <p
                                                        onClick={() => {
                                                            dispatch(selectItem(defaultAddress));
                                                            setShowAddress(false);
                                                        }}
                                                        className="p-2 cursor-pointer border-b border-border hover:bg-primary hover:text-white"
                                                    >
                                                        {defaultAddress.street}, {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.city}
                                                    </p>
                                                )}
                                                {nonDefaultAddresses.map((address, index) => (
                                                    <div
                                                        key={`non-default-${index}`}
                                                        onClick={() => {
                                                            dispatch(selectItem(address));
                                                            setShowAddress(false);
                                                        }}
                                                        className="p-2 cursor-pointer border-b border-border hover:bg-primary hover:text-white flex justify-between items-center group"
                                                    >
                                                        <p>
                                                            {address.street}, {address.ward}, {address.district}, {address.city}
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                title="Set as default"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    dispatch(chooseDefaultAddress({ id: address.id }));
                                                                }}
                                                                className="text-primary bg-transparent hover:bg-transparent group-hover:text-white shadow-none border border-transparent hover:border-border"
                                                                size={"icon"}>
                                                                <Flag />
                                                            </Button>
                                                            <Button
                                                                title="Remove this address"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    dispatch(removeAddress({ id: address.id }));
                                                                }}
                                                                className="bg-transparent hover:bg-transparent text-red-600 group-hover:text-red-500 shadow-none border border-transparent hover:border-border"
                                                                size={"icon"}>
                                                                <Trash2 />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="p-2">
                                                    <button
                                                        onClick={() => {
                                                            if (appState.logined) navigate("/add-address");
                                                            else dispatch(setShowUserLogin(true));
                                                        }}
                                                        className="text-center cursor-pointer p-1.5 bg-primary text-white w-full rounded-md"
                                                    >
                                                        {t(`cart.buttonAddress`)}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                </div>

                                <p className="text-sm font-medium uppercase mt-6">{t(`cart.payment.title`)}</p>

                                <select
                                    onChange={(e) => dispatch(setPaymentOption(e.target.value as "COD" | "Online"))}
                                    className="w-full border border-gray-300 bg-background px-3 py-2 mt-2 outline-none"
                                    value={paymentState.paymentOption}>
                                    <option value="COD">{t(`cart.payment.cash.title`)}</option>
                                    <option value="Online">{t(`cart.payment.online.title`)}</option>
                                </select>
                            </div>

                            <hr className="border-gray-300" />

                            <div className="text-muted-foreground mt-4 space-y-2">
                                <p className="flex justify-between">
                                    <span>{t(`cart.price`)}</span><span>{getCartAmount().toLocaleString()}{currency}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>{t(`cart.ship`)}</span><span className="text-green-600">
                                        {t(`cart.free`)}
                                    </span>
                                </p>
                                <p className="flex justify-between">
                                    <span>{t(`cart.tax`)} (2%)</span><span>{Number(getCartAmount() * 0.02).toLocaleString()}{currency}</span>
                                </p>
                                <p className="flex justify-between text-lg font-medium mt-3">
                                    <span>{t(`cart.total`)}:</span><span>{Number(getCartAmount() + getCartAmount() * 0.02).toLocaleString()}{currency}</span>
                                </p>
                            </div>

                            <button
                                onClick={placeOrder}
                                disabled={cartArr.length === 0 || addressState.list.length === 0}
                                className="w-full py-3 mt-6 rounded-md cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition disabled:!cursor-not-allowed disabled:bg-muted-foreground">
                                {
                                    paymentState.paymentOption === "COD" ?
                                        t(`cart.payment.cash.button`) :
                                        t(`cart.payment.online.button`)
                                }
                            </button>
                        </div>
                    </div> : null
            }

            {paymentState.showCheckoutOnline && <CheckoutOnline dataPayment={cartArr} isPlaceOrder={true} />}
        </>
    )
}
export default Cart