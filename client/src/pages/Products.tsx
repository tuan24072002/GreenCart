import FilterDropdown from "@/components/FilterDropdown";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { useAppContext } from "@/context/AppContext"
import { useEffect, useState } from "react";

const Products = () => {
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
            setFilteredProducts(products);
        }
    }, [products, searchQuery])
    return (
        <Title
            title="All Products"
            highlight>
            <div className="flex flex-col lg:flex-row gap-6">
                <FilterDropdown className="lg:w-1/6 w-full mt-6 grid lg:grid-cols-1 md:grid-cols-4 grid-cols-2 h-fit gap-6 md:gap-3" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-3 md:gap-6">
                    {
                        filteredProducts.filter((product) => product.inStock).map((item, index) => (
                            <ProductCard key={`productCard-${index}`} product={item} />
                        ))
                    }
                </div>
            </div>
        </Title>
    )
}

export default Products