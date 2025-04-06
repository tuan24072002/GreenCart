import Title from "./Title"
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const BestSeller = () => {
    const { products } = useAppContext();
    return (
        <Title title="BestSeller">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-6">
                {
                    products
                        .filter(product => product.inStock)
                        .slice(0, 5)
                        .map((product, index) =>
                            <ProductCard key={`productCard-${index}`} product={product} />)
                }
            </div>
        </Title>
    )
}

export default BestSeller