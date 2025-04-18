import dataVieNam from "@/data/vietnam_provinces.json";
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type Props = {
    value: string,
    onChange: (value: string) => void,
    province: string,
    district: string,
    placeholder?: string
}
const Ward = ({ value, onChange, province, district, placeholder }: Props) => {
    const [open, setOpen] = useState(false);
    const [popoverWidth, setPopoverWidth] = useState<number | undefined>();
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const selectedProvince = dataVieNam.find(
        (item) => item.FullName === province
    )
    const selectedDistrict = selectedProvince?.District.find(
        (d) => d.FullName === district
    );
    const wards = selectedDistrict?.Ward || [];
    useEffect(() => {
        if (buttonRef.current) {
            setPopoverWidth(buttonRef.current.offsetWidth);
        }
    }, [open]);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={buttonRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={!district}
                    className={cn("w-full px-2 py-5 border border-input rounded outline-none focus:border-primary transition flex items-center justify-between font-normal", value === "" ? "text-muted-foreground" : "text-accent-foreground")}
                >
                    {value
                        ? value
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" style={{ width: popoverWidth }} className="!p-0 !no-scrollbar">
                <Command>
                    <CommandInput placeholder={"Search ward..."} />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {wards.map((ward) => (
                                <CommandItem
                                    key={ward.FullName}
                                    value={ward.FullName}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === ward.FullName ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {ward.FullName}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default Ward