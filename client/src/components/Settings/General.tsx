import { useThemeContext } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const General = () => {
    const { theme, setTheme } = useThemeContext();
    return (
        <div className="pt-4 pl-2">
            <div className="flex flex-col gap-2 w-fit">
                <p className="text-lg font-medium text-accent-foreground">Toggle theme: <span className="capitalize">{theme}</span></p>
                <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3 w-fit">
                    <input checked={theme === "dark"} onChange={(e) => e.target.checked ? setTheme("dark") : setTheme("light")} type="checkbox" className="sr-only peer w-fit" />
                    <div className="w-16 h-8 bg-foreground rounded-full peer transition-colors duration-200" />
                    <div className="dot absolute left-1 top-1 w-6 h-6 bg-background rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-8 flex items-center justify-center">
                        {
                            theme === "dark" ? <Moon className="text-yellow-300 size-4" /> : <Sun className="text-black size-4" />
                        }
                    </div>
                </label>
            </div>
        </div>
    )
}

export default General