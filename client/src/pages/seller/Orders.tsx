import { assets, dummyOrders } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";


const Orders = () => {
    const { currency } = useAppContext();
    const [orders, setOrders] = useState<OrderType[]>([]);
    const fetchOrders = async () => {
        setOrders(dummyOrders);
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div className="md:p-10 p-4 space-y-4 w-full">
            <h2 className="text-lg font-medium">Orders List</h2>
            <div className="space-y-4 h-[calc(100vh-155px)] overflow-y-auto no-scrollbar w-full">
                {orders.map((order, index) => (
                    <div key={index} className="flex flex-col w-full md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
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

                        <div className="text-sm md:text-base text-black/60">
                            <p className='text-black/80'>
                                {order.address.firstName} {order.address.lastName}
                            </p>
                            <p>
                                {order.address.street}, {order.address.city}</p>
                            <p>
                                {order.address.state}, {order.address.zipcode}, {order.address.country}
                            </p>
                            <p>{order.address.phone}</p>
                        </div>

                        <p className="font-medium my-auto">
                            {order.amount?.toLocaleString()}{currency}
                        </p>

                        <div className="flex flex-col text-sm">
                            <p>Method: {order.paymentType}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Payment: {order.isPaid ? <span className="text-primary">Paid</span> : <span className="text-destructive">Pending</span>}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orders