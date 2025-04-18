import DatePicker from "react-datepicker";
import { Button } from "./ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Tooltip } from "react-tooltip"
type Props = {
    label: string;
    date: Date | null;
    setDate: any;
    className?: string;
}
const DatePick = ({ label, date, setDate, className }: Props) => {
    return (
        <Popover>
            <PopoverTrigger data-tooltip-id={label} asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground", className
                    )}
                >
                    <CalendarIcon />
                    {date ? format(date, "MM/dd/yyyy") : <span>{label}</span>}
                </Button>
            </PopoverTrigger>
            <Tooltip
                id={label}
                place="bottom"
                variant="dark"
                content={label}
            />
            <PopoverContent className="w-auto !p-0 !h-full flex items-center justify-center" align="end">
                <DatePicker
                    className="h-full bg-red-700"
                    inline
                    selected={date}
                    onChange={(date) => setDate(date!)} />
            </PopoverContent>
        </Popover>
    );
};
export default DatePick