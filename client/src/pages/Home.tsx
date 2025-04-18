import { useAppDispatch } from "@/app/hooks"
import BestSeller from "@/components/BestSeller"
import BottomBanner from "@/components/BottomBanner"
import Category from "@/components/Category"
import MainBanner from "@/components/MainBanner"
import NewsLetter from "@/components/NewsLetter"
import { fetchAll } from "@/slice/product/Product.slice"
import { useEffect } from "react"

const Home = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchAll());
    }, [dispatch])
    return (
        <div className="mt-10">
            <MainBanner />
            <Category />
            <BestSeller />
            <BottomBanner />
            <NewsLetter />
        </div>
    )
}

export default Home