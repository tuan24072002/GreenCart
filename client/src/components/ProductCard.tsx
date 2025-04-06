import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }: { product: ProductType }) => {
    const { currency, addToCart, removeFromCart, cartItem, navigate } = useAppContext();
    return product && (
        <div onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product._id}`)} className="border border-gray-500/20 rounded-md max-w-54 md:px-4 px-3 py-2">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img className="group-hover:scale-110 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                        <img
                            key={`star-${i}`}
                            className='md:w-3.5 w-3'
                            src={product.rating > i ? assets.star_icon : assets.star_dull_icon}
                            alt="Star" />
                    ))}
                    <p>({product.rating})</p>
                </div>
                <div className="flex flex-col mt-3">
                    <p className="text-base font-medium text-primary">
                        {product.offerPrice?.toLocaleString()}{currency}{" "}<span className="text-gray-500/60 md:text-sm text-xs line-through">{product.price?.toLocaleString()}{currency}</span>
                    </p>
                    <div onClick={(e) => e.stopPropagation()} className="text-primary ml-auto">
                        {!cartItem[product._id] ? (
                            <button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded  font-medium" onClick={() => addToCart(product._id)} >
                                <img src={assets.cart_icon} alt="Cart Icon" />
                                <span className='lg:text-sm text-xs'>Add</span>
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/10 rounded select-none">
                                <button onClick={() => removeFromCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItem[product._id]}</span>
                                <button onClick={() => addToCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard