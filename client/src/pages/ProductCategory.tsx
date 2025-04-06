
import { assets } from "@/assets/assets";
import FilterDropdown from "@/components/FilterDropdown";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title"
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const ProductCategory = () => {
    const { category } = useParams();
    const { products, searchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState<ProductType[] | []>([]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            setFilteredProducts(
                products.filter(
                    (product) =>
                        product.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredProducts(products.filter(
                (product) =>
                    product.category.toLowerCase().includes(category as string)
            ));
        }
    }, [category, products, searchQuery])

    return (
        filteredProducts.length > 0 ?
            <Title
                highlight
                showBreadcrumb
                title={category as string}>
                <div className="flex flex-col lg:flex-row gap-6">
                    <FilterDropdown category={category as string} className="lg:w-1/6 w-full mt-6 grid lg:grid-cols-1 md:grid-cols-4 grid-cols-2 h-fit gap-6 md:gap-3" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-3 md:gap-6">
                        {
                            filteredProducts.filter((product) => product.inStock).map((item, index) => (
                                <ProductCard key={`productCard-${index}`} product={item} />
                            ))
                        }
                    </div>
                </div>
            </Title> : <div className="flex flex-col gap-4 items-center justify-center h-[60vh]">
                <img src={assets.empty_box} alt="Empty" className="w-52" />
                <h1 className="md:text-2xl sm:text-base text-sm font-semibold text-primary">No products found in this category.</h1>
            </div>
    )
}

export default ProductCategory