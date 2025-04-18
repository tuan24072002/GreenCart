import { useAppDispatch, useAppSelector } from "@/app/hooks";
import FilterDropdown from "@/components/FilterDropdown";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { fetchAll, resetList } from "@/slice/product/Product.slice";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';

const Products = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const productState = useAppSelector(state => state.product);
    const loadMore = () => {
        setTimeout(() => {
            dispatch(fetchAll({ page: productState.page + 1 }))
        }, 500);
    }

    useEffect(() => {
        dispatch(resetList());
        dispatch(fetchAll());
    }, [dispatch])
    return (
        <Title
            showBreadcrumb
            title={t("products.title")}
            highlight>
            <div className="flex flex-col lg:flex-row gap-6 pb-24">
                <FilterDropdown className="lg:w-1/6 w-full mt-6 grid lg:grid-cols-1 md:grid-cols-4 grid-cols-2 h-fit gap-6 md:gap-3" />
                <InfiniteScroll
                    hasMore={productState.hasMore}
                    loader={
                        <div className="col-span-full flex justify-center my-6">
                            <p className="text-center text-lg">Loading...</p>
                        </div>
                    }
                    dataLength={productState.filtered.length}
                    next={loadMore}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-3 md:gap-6 flex-1">
                    {
                        productState.filtered.filter((product) => product.inStock).map((item, index) => {
                            return (
                                <div key={`productCard-${index}`}>
                                    <ProductCard product={item} />
                                </div>
                            )
                        })
                    }
                </InfiniteScroll>
            </div>
        </Title>
    )
}

export default Products