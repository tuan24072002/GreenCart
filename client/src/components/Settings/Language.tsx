import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { supportedLanguages } from "@/utils/languages"
import { useTranslation } from "react-i18next"

const Language = () => {
    const { i18n, t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(localStorage.getItem("language") ?? "");

    useEffect(() => {
        if (value === "") {
            setValue("vi");
        }
        i18n.changeLanguage(value);
    }, [value, i18n])
    return (
        <div className="pt-4 pl-2 space-y-2">
            <p className="text-lg font-medium text-accent-foreground">{t("settings.Language.title")}:</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {value
                            ? <div className="flex items-center gap-2">
                                <img src={supportedLanguages.find((framework) => framework.code === value)?.image} alt="Flag" className="size-5" />
                                {supportedLanguages.find((framework) => framework.code === value)?.label}
                            </div>
                            : "Select framework..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        {/* <CommandInput placeholder="Search framework..." /> */}
                        <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                                {supportedLanguages.map((framework) => (
                                    <CommandItem
                                        key={framework.code}
                                        value={framework.code}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === framework.code ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <img src={framework.image} alt={framework.label} className="size-5" />
                                        {framework.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default Language