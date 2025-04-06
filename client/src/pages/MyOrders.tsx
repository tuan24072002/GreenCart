import { dummyOrders } from "@/assets/assets";
import Title from "@/components/Title"
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react"

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState<OrderType[]>([]);
    const { currency } = useAppContext();

    const fetchMyOrders = async () => {
        setMyOrders(dummyOrders);
    }

    useEffect(() => {
        fetchMyOrders();
    }, [])
    return (
        <Title
            className="pb-16  mx-auto max-w-7xl"
            title="My Orders"
            highlight
        >
            <div className="mt-8">
                {
                    myOrders.map((order, index) => (
                        <div
                            className="border border-gray-300 rounded-lg mb-10 px-4 py-5"
                            key={`order-${index}`}>
                            <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
                                <span>OrderId: <span className="font-semibold text-primary">{order._id}</span></span>
                                <span>Payment: <span className="font-semibold text-primary">{order.paymentType}</span></span>
                                <span>Total Amount: <span className="font-semibold text-primary">{order.amount?.toLocaleString()}{currency}</span></span>
                            </p>
                            {
                                order.items.map((item, index) => (
                                    <div className={cn(
                                        "relative bg-white text-gray-500/70 border-gray-300 flex flex-col md:flex-row md:items-center justify-between px-4 py-5 md:gap-16 w-full max-w-7xl", index !== order.items.length - 1 && "border-b"
                                    )} key={`item-${index}`}>
                                        <div className="flex items-center mb-4 md:mb-0">
                                            <div className="bg-primary/10 p-4 rounded-lg">
                                                <img
                                                    src={item.product.image[0]}
                                                    alt={item.product.name}
                                                    className="size-16"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h2 className="text-xl font-medium text-gray-800">{item.product.name}</h2>
                                                <p>Category: <span className="font-semibold text-primary">{item.product.category}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                                            <p>Quantity: <span className="font-semibold text-primary">{item.quantity || 1}</span></p>
                                            <p>Status: <span className="font-semibold text-primary">{order.status}</span></p>
                                            <p>Date: <span className="font-semibold text-primary">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                        </div>
                                        <p className="text-lg font-medium">
                                            Amount: <span className="font-semibold text-primary">{item.product.offerPrice?.toLocaleString()}{currency}</span>
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </Title>
    )
}

export default MyOrders