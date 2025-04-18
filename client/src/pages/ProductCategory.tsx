import { useAppDispatch, useAppSelector } from "@/app/hooks";
import FilterDropdown from "@/components/FilterDropdown";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import Title from "@/components/Title"
import { fetchAll } from "@/slice/product/Product.slice";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom"

const ProductCategory = () => {
    const { t } = useTranslation();
    const { category } = useParams();
    const dispatch = useAppDispatch();
    const productState = useAppSelector(state => state.product);

    useEffect(() => {
        dispatch(fetchAll());
    }, [dispatch])
    return (
        <Title
            highlight
            showBreadcrumb
            title={t(`products.category.${category?.toLowerCase()}`)}>
            <div className="flex flex-col lg:flex-row gap-6">
                <FilterDropdown category={category as string} className="lg:w-1/6 w-full mt-6 grid lg:grid-cols-1 md:grid-cols-4 grid-cols-2 h-fit gap-6 md:gap-3" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-3 md:gap-6 flex-1 pb-24">
                    {
                        productState.status === "loading" ?
                            Array.from({ length: 12 }).map((_, index) => <ProductCardSkeleton key={index} />) :
                            productState.filtered.filter((product) => product.inStock).map((item, index) => (
                                <ProductCard key={`productCard-${index}`} product={item} />
                            ))
                    }
                </div>
            </div>
        </Title>
    )
}

export default ProductCategory