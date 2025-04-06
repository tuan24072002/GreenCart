import BestSeller from "@/components/BestSeller"
import BottomBanner from "@/components/BottomBanner"
import Category from "@/components/Category"
import MainBanner from "@/components/MainBanner"
import NewsLetter from "@/components/NewsLetter"

const Home = () => {
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