import { footerLinks } from "@/assets/assets"
import { Logo } from "@/assets/icon"
import { useThemeContext } from "@/context/ThemeContext"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const Footer = () => {
    const { t } = useTranslation();
    const { theme } = useThemeContext();
    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10 dark:bg-primary/50">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    {/* <img className="w-34 md:w-32" src={assets.logo} alt="Logo" /> */}
                    {<Logo color={theme === "light" ? "#2B3441" : "#fff"} />}
                    <p className="max-w-[410px] mt-6 text-muted-foreground">{t(`footer.slogan`)}</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-accent-foreground md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link to={link.url} className="hover:underline transition  text-muted-foreground">
                                            {t(`footer.${section.title}.${link.text}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-muted-foreground">
                Copyright {new Date().getFullYear()} © <a target="_blank" href="https://tranleanhtuan.site">TranLeAnhTuan.site</a> All Right Reserved.
            </p>
        </div>
    )
}

export default Footer