import { assets, features } from "@/assets/assets"
import { useTranslation } from "react-i18next"

const BottomBanner = () => {
    const { t } = useTranslation();
    return (
        <div className="relative mt-24">
            <img
                src={assets.bottom_banner_image}
                alt={"Bottom Banner"}
                loading="lazy"
                className="w-full hidden md:block" />
            <img
                src={assets.bottom_banner_image_sm}
                alt={"Bottom Banner"}
                className="w-full md:hidden" />
            <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24">
                <div className="">
                    <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6">{t(`home.why.title`)}</h1>
                    {
                        features.map((feature, index) => (
                            <div className="flex items-center gap-4 mt-2" key={`feature-${index}`}>
                                <img
                                    src={feature.icon}
                                    alt={feature.title}
                                    loading="lazy"
                                    className="md:w-11 w-9" />
                                <div className="flex flex-col">
                                    <h3 className="text-lg md:text-xl font-semibold text-accent-foreground">{t(`home.why.rs${index + 1}.title`)}</h3>
                                    <p className="text-muted-foreground text-xs md:text-sm">{t(`home.why.rs${index + 1}.desc`)}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default BottomBanner