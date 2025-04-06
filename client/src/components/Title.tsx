import { cn } from "@/lib/utils"
import { ReactNode } from "react"
interface Props {
    children: ReactNode,
    title: string,
    highlight?: boolean,
    className?: string,
}
const Title = ({ children, title, highlight = false, className, }: Props) => {
    return (
        <div className={cn("flex flex-col mt-16", className)}>
            <div className="flex flex-col items-end w-max">
                <p className={cn("text-2xl md:text-3xl font-medium uppercase")}>
                    {title}
                </p>
                {highlight && <div className="w-16 h-0.5 bg-primary rounded-full" />}
            </div>
            {children}
        </div>
    )
}

export default Title