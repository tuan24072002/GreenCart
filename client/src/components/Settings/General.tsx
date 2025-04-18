import { useThemeContext } from "@/context/ThemeContext";
import { Moon, SendHorizontal, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InputField } from "../InputField";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useState } from "react";
import { updateUser } from "@/slice/user/User.slice";

const General = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { theme, setTheme } = useThemeContext();
    const appState = useAppSelector(state => state.app);
    const [name, setName] = useState(appState.user?.name || "");
    const handleChangeName = async () => {
        await dispatch(updateUser({ name }));
    }

    return (
        <div className="pt-4 ml-2">
            <div className="space-y-6">
                <div className="flex flex-col gap-2 max-w-[230px]">
                    <Label htmlFor="name" className="text-lg font-medium text-accent-foreground">{t("settings.General.changeName")}:</Label>
                    <div className="relative">
                        <InputField
                            id="name"
                            name="name"
                            type="name"
                            placeholder="Enter your name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <Button onClick={handleChangeName} size="icon" className="absolute top-1/2 -translate-y-1/2 right-1">
                            <SendHorizontal />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-fit">
                    <p className="text-lg font-medium text-accent-foreground">{t("settings.General.toggleTheme")}: <span className="capitalize">{t(`settings.General.${theme}`)}</span></p>
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
        </div>
    )
}

export default General