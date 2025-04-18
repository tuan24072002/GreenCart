import { useAppDispatch, useAppSelector } from "@/app/hooks";
import OrderDetail from "@/components/order/OrderDetail";
import Title from "@/components/Title"
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { getUserOrders } from "@/slice/order/Order.slice";
import { includeTax } from "@/utils/util";
import { useEffect } from "react"
import { useTranslation } from "react-i18next";

const MyOrders = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const orderState = useAppSelector(state => state.order);
    const { currency } = useAppContext();


    useEffect(() => {
        dispatch(getUserOrders());
    }, [dispatch])
    return (
        <Title
            className="pb-16  mx-auto max-w-7xl"
            title={t(`myOrders.title`)}
            highlight
        >
            <div className="mt-8">
                {
                    orderState.status === "loading" ?
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex flex-col w-full md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 rounded-md border border-gray-300 text-gray-800 mb-10">
                                <div className="flex flex-wrap gap-5 w-full">
                                    <Skeleton className="size-12" />
                                    <div className="lg:grid lg:grid-cols-2 flex items-center gap-2 flex-wrap flex-1">
                                        <div key={index} className="flex flex-col justify-center">
                                            <Skeleton className="h-4 max-w-40" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-4 max-w-40" />
                                    <Skeleton className="h-4 max-w-40" />
                                    <Skeleton className="h-4 max-w-40" />
                                    <Skeleton className="h-4 max-w-40" />
                                </div>
                                <Skeleton className="h-4 max-w-40" />
                                <div className="space-y-4">
                                    <Skeleton className="h-4 max-w-40" />
                                    <Skeleton className="h-4 max-w-40" />
                                    <Skeleton className="h-4 max-w-40" />
                                </div>
                            </div>
                        )) :
                        orderState.list?.length > 0 && orderState.list?.map((order, index) => {
                            return (
                                <div
                                    className="relative border border-border bg-background rounded-lg mb-10 px-4 py-5"
                                    key={`order-${index}`}>
                                    <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col px-4">
                                        <span>{t(`myOrders.orderId`)}: <span className="font-semibold text-primary">{order.id}</span></span>
                                        <span>{t(`myOrders.paymentType`)}: <span className="font-semibold text-primary">{order.paymentType}</span></span>
                                        <span>{t(`myOrders.total`)}: <span className="font-semibold text-primary">{order.amount?.toLocaleString()}{currency}</span></span>
                                    </p>
                                    {
                                        order.items.map((item, index) => (
                                            <div className={cn(
                                                "relative text-gray-500/70 border-gray-300 flex flex-col md:flex-row md:items-center justify-between px-4 py-5 md:gap-16 w-full max-w-7xl", index !== order.items.length - 1 && "border-b"
                                            )} key={`item-${index}`}>
                                                <div className="flex items-center mb-4 md:mb-0">
                                                    <div className="bg-primary/10 dark:bg-primary p-4 rounded-lg">
                                                        <img
                                                            src={import.meta.env.VITE_BACKEND_URL + item.product.image[0].slice(1)}
                                                            alt={item.product.name}
                                                            className="size-16"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <h2 className="text-xl font-medium text-gray-800">{item.product.name}</h2>
                                                        <p>{t(`myOrders.category`)}: <span className="font-semibold text-primary">{t(`products.category.${item.product.category.toLowerCase()}`)}</span></p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center mb-4 md:mb-0">
                                                    <p>{t(`myOrders.quantity`)}: <span className="font-semibold text-primary">{item.quantity || 1}</span></p>
                                                    <p>{t(`myOrders.status`)}: <span className="font-semibold text-primary">{t(`myOrders.${order.status}`)}</span></p>
                                                    <p>{t(`myOrders.date`)}: <span className="font-semibold text-primary">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                                </div>
                                                <div className="flex flex-col justify-center mb-4 md:mb-0">
                                                    <p className="font-medium">
                                                        {t(`myOrders.amount`)}: <span className="font-semibold text-primary">{(includeTax(item.product.offerPrice))?.toLocaleString()}{currency}</span>
                                                    </p>
                                                    <p className="font-medium">
                                                        {t(`myOrders.payment`)}: <span className="font-semibold text-primary">{order.isPaid ?
                                                            <span className="text-primary">{t(`myOrders.paid`)}</span> :
                                                            <span className="text-destructive">{t(`myOrders.pending`)}</span>}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <OrderDetail order={order} />
                                </div>
                            )
                        })
                }
            </div>
        </Title>
    )
}

export default MyOrders