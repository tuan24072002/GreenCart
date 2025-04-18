import Title from "./Title"
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";

const BestSeller = () => {
    const { t } = useTranslation();
    const productState = useAppSelector(state => state.product);
    return (
        productState.list
            .filter(product => product.inStock && product.rating >= 4)
            .slice(0, 5)?.length > 0 &&
        <Title title={t(`home.bestSeller`)}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-6">
                {
                    productState.list
                        .filter(product => product.inStock && product.rating >= 4)
                        .slice(0, 5)
                        .map((product, index) =>
                            <ProductCard key={`productCard-${index}`} product={product} />)
                }
            </div>
        </Title>
    )
}

export default BestSeller