import { cn } from "@/lib/utils";
import { HandCoins, Package, ShoppingBasket, User } from "lucide-react";
import { Tooltip } from "react-tooltip"
import CountUp from "../ReactBits/CountUp";
import { useAppSelector } from "@/app/hooks";
import { Skeleton } from "../ui/skeleton";

const Summary = () => {
    const dashboardState = useAppSelector(state => state.dashboard);
    const totals = dashboardState.item.summary;
    const stats = [
        {
            _id: "1",
            label: "Total Users",
            total: totals["users"] || 0,
            icon: <User />,
            bg: "bg-[#1d4ed8]",
        },
        {
            _id: "2",
            label: "Total Products",
            total: totals["products"] || 0,
            icon: <Package />,
            bg: "bg-[#0f766e]",
        },
        {
            _id: "3",
            label: "Total Orders",
            total: totals["orders"] || 0,
            icon: <ShoppingBasket />,
            bg: "bg-[#f59e0b]",
        },
        {
            _id: "4",
            label: "Revenue",
            total: totals["revenue"] || 0,
            icon: <HandCoins />,
            bg: "bg-[#be185d]",
        },
    ];
    const Card = ({ icon, bg, label, total }: { icon: any, bg: string, label: string, total: number }) => (
        <div className="w-full h-32 bg-accent p-5 shadow-md rounded-md flex items-center justify-between">
            <div className="h-full flex flex-1 flex-col justify-center items-center gap-4">
                <p className="text-sm lg:text-base lg:uppercase line-clamp-1 capitalize text-accent-foreground">{label}</p>
                <span className="text-base font-semibold text-primary-dull">
                    <CountUp
                        from={0}
                        to={total}
                        separator=","
                        direction="up"
                        duration={1} />
                </span>
            </div>
            <div data-tooltip-id={label} className={cn("size-10 rounded-full flex items-center justify-center text-white cursor-pointer", bg)}>
                {icon}
            </div>
            <Tooltip
                id={label}
                place="bottom"
                variant="dark"
                content={label}
            />
        </div>
    )
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {
                dashboardState.status === "loading" ?
                    Array.from({ length: 4 }).map((_, index) => (
                        <div className="w-full h-32 bg-accent p-5 shadow-md rounded-md flex items-center justify-between gap-10" key={`Skeleton dashboard: ${index}`}>
                            <div className="h-full flex flex-1 flex-col justify-center items-center gap-4">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-full h-4" />
                            </div>
                            <Skeleton className="size-12 rounded-full flex items-center justify-center text-white cursor-pointer" />
                        </div>
                    )) :
                    stats.map(({ icon, bg, label, total }, index) => (
                        <Card
                            key={`Card dashboard: ${index}`}
                            icon={icon}
                            bg={bg}
                            label={label}
                            total={total}
                        />
                    ))
            }
        </div>
    )
}

export default Summary