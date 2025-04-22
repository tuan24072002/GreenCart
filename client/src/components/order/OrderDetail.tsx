import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { OrderModel } from "@/models/Order.model"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { includeTax } from "@/utils/util"
import { useAppContext } from "@/context/AppContext"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { SquareArrowOutUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { resetActionStatePayment, setShowCheckoutOnline } from "@/slice/payment/Payment.slice"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import CheckoutOnline from "../payment/CheckoutOnline"
import { selectItem } from "@/slice/order/Order.slice"
import toast from "react-hot-toast"
import { processing } from "@/utils/alert"
import { useTranslation } from "react-i18next"


const OrderDetail = ({ order }: { order: OrderModel }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const paymentState = useAppSelector(state => state.payment);
    const { currency } = useAppContext();
    const [open, setOpen] = useState(false);

    const dataPay: ProductType[] = order.items.map((item) => ({
        ...item.product,
        quantity: item.quantity,
    }))
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

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className={cn("absolute bottom-2 right-4 bg-transparent shadow-none active:scale-80", order.isPaid ? "hover:bg-primary-dull text-primary hover:text-white" : "hover:bg-destructive/80 text-destructive hover:text-white")}>
                        <SquareArrowOutUpRight />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-x-hidden overflow-y-auto no-scrollbar z-40">
                    <DialogHeader>
                        <DialogTitle className="flex md:flex-row flex-col md:items-center items-start gap-4">
                            <div className="flex items-center gap-2">
                                <span>{t(`orderDetail.title`)}</span>
                                <Badge variant={order.isPaid ? "default" : "destructive"}>
                                    {order.isPaid ? t(`orderDetail.paid`) : t(`orderDetail.pending`)}
                                </Badge>
                            </div>
                            <span className="text-sm font-normal text-muted-foreground">
                                {t(`orderDetail.createdAt`)}: {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="flex md:flex-row flex-col md:items-center items-start justify-between text-sm">
                            <div>
                                <p className="text-muted-foreground">{t(`orderDetail.orderId`)}</p>
                                <p className="font-medium">{order.id}</p>
                            </div>
                            <div className="md:text-right">
                                <p className="text-muted-foreground">{t(`orderDetail.paymentType`)}</p>
                                <p className="font-medium">{order.paymentType}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="font-semibold">{t(`orderDetail.orderItems`)}</h3>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={`order-item-${index}`} className="flex items-center gap-4">
                                        <div className="h-20 w-20 overflow-hidden rounded-lg bg-primary/10 dark:bg-primary">
                                            <img
                                                src={import.meta.env.VITE_BACKEND_URL + item.product.image[0].slice(1)}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.product.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {t(`orderDetail.category`)}: {t(`products.category.${item.product.category?.toLowerCase()}`)}
                                            </p>
                                            <div className="mt-1 flex md:flex-row flex-col md:items-center items-start justify-between">
                                                <p className="text-sm">{t(`orderDetail.quantity`)}: {item.quantity}</p>
                                                <div className="flex items-center gap-1">
                                                    <p className="font-medium text-primary">
                                                        {includeTax(item.product.offerPrice)}{currency}
                                                    </p>
                                                    <p className="font-medium line-through text-sm text-muted-foreground">
                                                        {includeTax(item.product.price)}{currency}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />
                        <div>
                            <h3 className="font-semibold">{t(`orderDetail.delivery`)}</h3>
                            <div className="space-y-4 mt-2">
                                <div className="flex md:flex-row flex-col justify-between text-sm">
                                    <p className="text-muted-foreground">{t(`orderDetail.name`)}</p>
                                    <p>{order.address.firstName} {order.address.lastName}</p>
                                </div>
                                <div className="flex md:flex-row flex-col justify-between text-sm">
                                    <p className="text-muted-foreground">{t(`orderDetail.phone`)}</p>
                                    <p>{order.address.phone}</p>
                                </div>
                                <div className="flex md:flex-row flex-col justify-between text-sm">
                                    <p className="text-muted-foreground">{t(`orderDetail.address`)}</p>
                                    <div className="md:text-right">
                                        <p>
                                            {order.address.street}, {order.address.ward},
                                        </p>
                                        <p>
                                            {order.address.district}, {order.address.city}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-semibold">{t(`orderDetail.orderSummary`)}</h3>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t(`orderDetail.subtotal`)}</span>
                                    <span>{Number(order.amount - order.amount * 0.02)?.toLocaleString()}{currency}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t(`orderDetail.deliveryFee`)}</span>
                                    <span>{t(`orderDetail.free`)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t(`orderDetail.tax`)} (2%)</span>
                                    <span>{Number(order.amount)?.toLocaleString()}{currency}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-medium">
                                    <span>{t(`orderDetail.total`)}</span>
                                    <span className="text-primary">{order.amount?.toLocaleString()}{currency}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-auto w-fit">
                            <Button className="bg-white hover:bg-white border text-black" onClick={() => setOpen(false)}>{t(`orderDetail.close`)}</Button>
                            {
                                order.isPaid ?
                                    <Button className="" onClick={() => setOpen(false)}>
                                        {t(`orderDetail.buyThisAgain`)}
                                    </Button> :
                                    <Button onClick={() => {
                                        dispatch(selectItem(order));
                                        dispatch(setShowCheckoutOnline(true))
                                    }
                                    }>
                                        {t(`orderDetail.payNow`)}
                                    </Button>
                            }
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {paymentState.showCheckoutOnline && <CheckoutOnline dataPayment={dataPay} isPlaceOrder={false} />}
        </>
    )
}

export default OrderDetail