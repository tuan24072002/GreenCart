import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { assets } from "@/assets/assets";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/context/AppContext";
import { getAllOrders } from "@/slice/order/Order.slice";
import { useEffect } from "react";


const Orders = () => {
    const dispatch = useAppDispatch();
    const orderState = useAppSelector(state => state.order);
    const { currency } = useAppContext();


    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch])
    return (
        <div className="md:p-10 p-4 space-y-4 w-full flex-1">
            <h2 className="text-lg font-medium">Orders List</h2>
            <div className="space-y-4 h-[calc(100vh-155px)] overflow-y-auto no-scrollbar w-full">
                {
                    orderState.status === "loading" ?
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex flex-col w-full md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 rounded-md border border-gray-300 text-gray-800">
                                <div className="flex flex-wrap gap-5 w-full">
                                    <Skeleton className="size-12" />
                                    <div className="lg:grid lg:grid-cols-2 flex items-center gap-2 flex-wrap flex-1">
                                        <div key={index} className="flex flex-col justify-center">
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                                <Skeleton className="h-4 w-40" />
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>
                        )) :
                        orderState.list?.length > 0 && orderState.list?.map((order, index) => (
                            <div key={index} className="flex flex-col w-full md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 rounded-md border border-gray-300 text-muted-foreground bg-accent">
                                <div className="flex flex-wrap gap-5 w-full">
                                    <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                                    <div className="lg:grid lg:grid-cols-2 flex items-center gap-2 flex-wrap flex-1">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex flex-col justify-center">
                                                <p className="font-medium">
                                                    {item.product.name}{" "}<span className={`text-primary`}>x {item.quantity}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-sm md:text-base text-accent-foreground/60">
                                    <p className='text-accent-foreground'>
                                        {order.address.firstName} {order.address.lastName}
                                    </p>
                                    <p>
                                        {order.address.street}, {order.address.ward},
                                    </p>
                                    <p>
                                        {order.address.district}, {order.address.city}
                                    </p>
                                    <p>{order.address.phone}</p>
                                </div>

                                <p className="font-medium my-auto">
                                    {order.amount?.toLocaleString()}{currency}
                                </p>

                                <div className="flex flex-col text-sm">
                                    <p>Method: {order.paymentType}</p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p>
                                        Payment: {order.isPaid ?
                                            <span className="text-primary">Paid</span> :
                                            <span className="text-destructive">Pending</span>}
                                    </p>
                                </div>
                            </div>
                        ))}
            </div>
        </div>
    );
}

export default Orders