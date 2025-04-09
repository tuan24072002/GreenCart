import Title from "./Title"
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "react-i18next";

const BestSeller = () => {
    const { t } = useTranslation();
    const { products } = useAppContext();
    return (
        <Title title={t(`home.bestSeller`)}>
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