import { categories } from "@/assets/assets"
import { useAppContext } from "@/context/AppContext"
import { cn } from "@/lib/utils"
import Title from "./Title";

const Category = () => {
    const { navigate } = useAppContext();
    return (
        <Title title="Categories">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 mt-6 gap-6">
                {
                    categories.map((category, index) => (
                        <div
                            key={`category-${index}`}
                            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center"
                            style={{ backgroundColor: category.bgColor }}
                            onClick={() => {
                                navigate(`/products/${category.path.toLowerCase()}`);
                            }} >
                            <img src={category.image} alt={category.text} className={cn("group-hover:scale-110 transition max-w-28")} />
                            <p className="text-sm font-medium">{category.text}</p>
                        </div>
                    ))
                }
            </div>
        </Title>
    )
}

export default Category