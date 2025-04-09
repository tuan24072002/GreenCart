import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

const ProductDetail = () => {
    const { t } = useTranslation();
    const { category, id } = useParams();
    const { products, navigate, currency, addToCart } = useAppContext();
    const product = products.find((product) => product._id === id);

    const [relatedProducts, setRelatedProducts] = useState<ProductType[] | []>([]);

    const [thumbnail, setThumbnail] = useState<string | null>(null);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = structuredClone(products);
            productsCopy = productsCopy.filter((item) => item.category === product?.category);
            setRelatedProducts(productsCopy);
        }
    }, [product?.category, products])

    useEffect(() => {
        setThumbnail(product?.image[0] || null);
    }, [product?.image])

    return (
        <div className="mt-12 max-w-7xl mx-auto">
            <p>
                <Link to="/">{t(`products.home`)}</Link> /
                <Link to="/products"> {t(`products.title`)}</Link> /
                <Link to={`/products/${category}`}> {t(`products.category.${category}`)}</Link> /
                <span className="text-primary"> {product?.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {
                            (product?.image || []).length > 0 ?
                                product?.image.map((image, index) => (
                                    <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                        <img src={image} alt={`Thumbnail ${index + 1}`} />
                                    </div>
                                ))
                                : Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                        <img src={"https://placehold.co/90x90.png"} alt={`Thumbnail ${index + 1}`} />
                                    </div>
                                ))
                        }
                    </div>

                    <div className="border border-gray-500/30 w-100 rounded overflow-hidden">
                        <img src={thumbnail || "https://placehold.co/400x400.png"} alt="Image Product" className="size-full object-cover" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product?.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img
                                key={`star-${i}`}
                                className='md:w-4 w-3.5'
                                src={(product?.rating ?? 0) > i ? assets.star_icon : assets.star_dull_icon}
                                alt="Star" />
                        ))}
                        <p className="text-base ml-2">({product?.rating ?? 0})</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">{product?.price?.toLocaleString()}{currency}</p>
                        <p className="text-2xl font-medium">{product?.offerPrice?.toLocaleString()}{currency}</p>
                        <span className="text-gray-500/70">{t(`productDetail.taxes`)}</span>
                    </div>

                    <p className="text-base font-medium mt-6">{t(`productDetail.about`)}</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product?.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={() => addToCart(product?._id || "")} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 rounded-md transition" >
                            {t(`productDetail.addToCart`)}
                        </button>
                        <button onClick={() => {
                            addToCart(product?._id || "");
                            navigate("/cart");
                        }} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white rounded-md hover:bg-primary-dull transition" >
                            {t(`productDetail.buyNow`)}
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium"> {t(`productDetail.related`)}</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-3 md:gap-6">
                    {
                        relatedProducts
                            .filter((item) => item._id !== product?._id)
                            .filter((item) => item.inStock)
                            .map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductDetail