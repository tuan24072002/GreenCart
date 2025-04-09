import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
interface Props {
    children: ReactNode,
    title: string,
    highlight?: boolean,
    className?: string,
    showBreadcrumb?: boolean
}
const Title = ({ children, title, highlight = false, className, showBreadcrumb }: Props) => {
    const { t } = useTranslation();
    const location = useLocation();
    return (
        <div className={cn("flex flex-col", className, showBreadcrumb ? "mt-10" : "mt-16")}>
            {showBreadcrumb &&
                <p className="mb-6">
                    <Link to="/">{t(`products.home`)}</Link>
                    {
                        location.pathname.split("/").map((path, index) => {
                            if (index !== location.pathname.split("/").length - 1) {
                                return (
                                    <span key={index}>
                                        <Link to={`/${path}`} > {path === "products" ? t(`products.title`) : path}</Link> /
                                    </span>
                                )
                            } else {
                                return (
                                    <span className="text-primary" key={index}> {path === "products" ? t(`products.title`) : t(`products.category.${path}`)}</span>
                                )
                            }
                        })
                    }
                </p>
            }
            <div className="flex flex-col items-end w-max">
                <p className={cn("text-2xl md:text-3xl font-medium uppercase text-accent-foreground")}>
                    {title}
                </p>
                {highlight && <div className="w-16 h-0.5 bg-primary rounded-full" />}
            </div>
            {children}
        </div>
    )
}

export default Title