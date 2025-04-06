import { assets, dummyAddress } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext"
import { useCallback, useEffect, useState } from "react"

const Cart = () => {
    const { products, currency, cartItem, removeFromCart, getCartCount, addToCart, getCartAmount, navigate } = useAppContext();
    const [cartArr, setCartArr] = useState<ProductType[]>([]);
    const [address] = useState(dummyAddress);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]);
    const [paymentOption, setPaymentOption] = useState<"COD" | "Online">("COD");

    const getCart = useCallback(() => {
        const tempArr = [];
        for (const key in cartItem) {
            const product = products.find((product) => product._id === key);
            if (product) {
                product.quantity = cartItem[key];
                tempArr.push(product);
            }
        }
        setCartArr(tempArr);
    }, [cartItem, products])

    const placeOrder = async () => {

    }
    useEffect(() => {
        if (products.length > 0 && cartItem) getCart();
    }, [products, cartItem, getCart])
    return (products.length > 0 && cartItem ?
        <div className="flex flex-col lg:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
            <div className='flex-1 max-w-4xl lg:mb-0 mb-10'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArr.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div
                                onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product._id}`)}
                                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70 flex flex-col gap-2">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/10 rounded select-none">
                                        <button onClick={() => removeFromCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                            -
                                        </button>
                                        <span className="w-5 text-center">{cartItem[product._id]}</span>
                                        <button onClick={() => addToCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{Number(product.offerPrice * (product.quantity || 1)).toLocaleString()}{currency}</p>
                        <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="Remove" className="inline-block size-6" />
                        </button>
                    </div>)
                )}

                <button onClick={() => navigate("/products")} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img src={assets.arrow_right_icon_colored} alt="Arrow" className="group-hover:-translate-x-1 transition" />
                    Continue Shopping
                </button>
            </div>

            <div className="lg:max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{
                            selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"
                        }</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {
                                    address.map((address, index) => (
                                        <p key={`address-${index}`} onClick={() => {
                                            setSelectedAddress(address);
                                            setShowAddress(false);
                                        }} className="text-gray-500 p-2 hover:bg-gray-100">
                                            {address.street}, {address.city}, {address.state}, {address.country}`
                                        </p>
                                    ))
                                }
                                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-pritext-primary/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select
                        onChange={(e) => setPaymentOption(e.target.value as "COD" | "Online")}
                        className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{getCartAmount().toLocaleString()}{currency}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{Number(getCartAmount() * 0.02).toLocaleString()}{currency}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>{Number(getCartAmount() + getCartAmount() * 0.02).toLocaleString()}{currency}</span>
                    </p>
                </div>

                <button
                    onClick={placeOrder}
                    className="w-full py-3 mt-6 rounded-md cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                    {
                        paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"
                    }
                </button>
            </div>
        </div> : null
    )
}
export default Cart