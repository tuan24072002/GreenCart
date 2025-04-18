import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { changeStock, fetchAll, resetActionState, resetList } from "@/slice/product/Product.slice";
import { Pen, Trash2 } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

const ProductList = () => {
    const dispatch = useAppDispatch();
    const productState = useAppSelector(state => state.product);
    const { currency } = useAppContext();

    const toggleStock = (product: ProductType) => {
        const payload = {
            id: product.id,
            inStock: !product.inStock
        }
        dispatch(changeStock(payload));
    }

    const loadMore = () => {
        if (productState.hasMore && productState.status !== 'loading') {
            setTimeout(() => {
                dispatch(fetchAll({ page: productState.page + 1, limit: 12 }));
            }, 500);
        }
    }

    useEffect(() => {
        dispatch(resetList());
        dispatch(fetchAll());
    }, [dispatch])

    useEffect(() => {
        switch (productState.statusAction) {
            case "failed":
                toast.error(productState.error ?? "Something went wrong!");
                dispatch(resetActionState());
                break;
            case "loading":
                break;
            case "completed":
                dispatch(fetchAll());
                dispatch(resetActionState());
                toast.success(productState.success ?? "Success!");
                break;
        }
    }, [dispatch, productState])
    return (
        <div className="flex-1 flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>
                <InfiniteScroll
                    hasMore={productState.hasMore}
                    loader={
                        <div className="flex justify-center my-6">
                            <p className="text-center text-lg">Loading...</p>
                        </div>
                    }
                    dataLength={productState.list.length}
                    next={loadMore}
                    scrollableTarget="scrollableDiv"
                >
                    <div id="scrollableDiv" className="flex flex-col items-center w-full rounded-md border border-gray-500/20 h-[calc(100vh-155px)] overflow-y-auto no-scrollbar">
                        <table className="md:table-auto table-fixed w-full">
                            <thead className="text-muted-foreground text-sm text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold truncate">Product</th>
                                    <th className="px-4 py-3 font-semibold truncate">Category</th>
                                    <th className="px-4 py-3 font-semibold max-sm:hidden">Price</th>
                                    <th className="px-4 py-3 font-semibold truncate lg:block hidden">In Stock</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-accent-foreground">
                                {
                                    productState.list.map((product, index) => {
                                        return (
                                            (
                                                <tr key={index} className="border-t border-gray-500/20">
                                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                                        <div className="border border-gray-300 rounded p-2 bg-primary/10 dark:bg-primary">
                                                            <img src={import.meta.env.VITE_BACKEND_URL + product.image[0]?.slice(1)} alt="Product" className="w-16" />
                                                        </div>
                                                        <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                                    </td>
                                                    <td className="px-4 py-3">{product.category}</td>
                                                    <td className="px-4 py-3 max-sm:hidden">{product.offerPrice?.toLocaleString()}{currency}</td>
                                                    <td className="px-4 py-3 lg:inline-block hidden mb-7">
                                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                                            <input type="checkbox" className="sr-only peer" defaultChecked={product.inStock} onClick={() => toggleStock(product)} />
                                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                                        </label>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className=" flex items-center gap-2">
                                                            <Button size="icon" className="bg-blue-600 hover:bg-blue-600/90">
                                                                <Pen />
                                                            </Button>
                                                            <Button size="icon" variant="destructive">
                                                                <Trash2 />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div >
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default ProductList