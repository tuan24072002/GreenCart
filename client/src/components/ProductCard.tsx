import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { includeTax } from '@/utils/util';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product }: { product: ProductType }) => {
    const { t } = useTranslation();
    const { currency, addToCart, minusCartItem, cartItems, navigate } = useAppContext();

    return product && (
        <div onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product.id}`)} className="border border-border bg-card rounded-md max-w-54 md:px-4 px-3 py-2">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img className="group-hover:scale-110 transition max-w-26 md:max-w-36" loading="lazy" src={import.meta.env.VITE_BACKEND_URL + product.image[0].slice(1)} alt={product.name} />
            </div>
            <div className="text-muted-foreground text-sm">
                <p>{t(`products.category.${product.category.toLowerCase()}`)}</p>
                <p className="text-accent-foreground font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                        <img
                            key={`star-${i}`}
                            className='md:w-3.5 w-3'
                            loading="lazy"
                            src={product.rating > i ? assets.star_icon : assets.star_dull_icon}
                            alt="Star" />
                    ))}
                    <p>({product.rating})</p>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                    <p className="text-base font-medium text-primary">
                        {includeTax(product.offerPrice)}{currency}{" "}<span className="text-muted-foreground md:text-sm text-xs line-through">{includeTax(product.price)}{currency}</span>
                    </p>
                    <div onClick={(e) => e.stopPropagation()} className="text-primary ml-auto">
                        {!cartItems[product.id] ? (
                            <button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded  font-medium" onClick={() => addToCart(product.id)} >
                                <img src={assets.cart_icon} alt="Cart Icon" />
                                <span className='lg:text-sm text-xs'>Add</span>
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/10 rounded select-none">
                                <button onClick={() => minusCartItem(product.id)} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product.id]}</span>
                                <button onClick={() => addToCart(product.id)} className="cursor-pointer text-md px-2 h-full" >
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