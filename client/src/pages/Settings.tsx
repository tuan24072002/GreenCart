import { useAppDispatch, useAppSelector } from "@/app/hooks";
import ChangePassword from "@/components/Settings/ChangePassword";
import General from "@/components/Settings/General";
import Language from "@/components/Settings/Language";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/Auth.service";
import { selectItem, setList } from "@/slice/address/Address.slice";
import { setLogined, setUser } from "@/slice/app/App.slice";
import { setCartItem } from "@/slice/cart/Cart.slice";
import { resetActionState, resetStateChangePass } from "@/slice/user/User.slice";
import { Languages, LayoutDashboard, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const Settings = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const appState = useAppSelector(state => state.app);
    const userState = useAppSelector(state => state.user);
    const location = useLocation();
    const { navigate } = useAppContext();
    const [module, setModule] = useState<"language" | "change-password" | undefined>(undefined);
    useEffect(() => {
        if (location.pathname) {
            setModule(location.pathname.split("/")[2] as "language" | "change-password" | undefined)
        }
    }, [location.pathname])
    const sidebarLinks = [
        { name: "General", path: "/settings", icon: <LayoutDashboard /> },
        { name: "Language", path: "/settings/language", icon: <Languages /> },
        { name: "Change Password", path: "/settings/change-password", icon: <LockKeyhole /> },
    ];
    useEffect(() => {
        if (!appState.logined) {
            navigate("/")
        }
    }, [appState.logined, navigate])

    useEffect(() => {
        switch (userState.statusAction) {
            case "failed":
                toast.error(userState.error ?? "");
                dispatch(resetActionState());
                break;
            case "loading":
                break;
            case "completed":
                toast.success(userState.success ?? "");
                dispatch(setUser(JSON.parse(localStorage.getItem("user") as string)));
                dispatch(resetActionState());
                break;
        }
    }, [appState.user?.name, dispatch, userState])
    useEffect(() => {
        switch (userState.statusChangePass) {
            case "failed":
                toast.error(userState.error ?? "");
                dispatch(resetStateChangePass());
                break;
            case "loading":
                break;
            case "completed":
                {
                    toast.success(userState.success ?? "");
                    dispatch(setLogined(false));
                    dispatch(setUser(null));
                    const authService = new AuthService();
                    authService.logout();
                    dispatch(setCartItem({}));
                    dispatch(setList([]));
                    dispatch(selectItem({}));
                    dispatch(resetStateChangePass());
                    navigate("/");
                }
                break;
        }
    }, [appState.user?.name, dispatch, userState])
    return (
        <div className={cn("flex w-full", appState.showTopBanner ? " h-[calc(100vh-296.85px-72.9px-40px)]" : "h-[calc(100vh-296.85px-72.9px)]")}>
            <div className="md:min-w-56 lg:min-w-64 min-w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                {sidebarLinks.map((item, index) => (
                    <Link to={item.path} key={index}
                        className={`flex items-center py-3 px-4 gap-3 
                            ${location.pathname === item.path ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                : "hover:bg-accent border-white text-accent-foreground"
                            }`
                        }
                    >
                        {item.icon}
                        <p className="md:block hidden text-center">{t(`settings.${item.name}.title`)}</p>
                    </Link>
                ))}
            </div>
            <div className="flex-1">
                {
                    module === "language" ? (
                        <Language />
                    ) : module === "change-password" ? (
                        <ChangePassword />
                    ) : (
                        <General />
                    )
                }
            </div>
        </div>
    )
}

export default Settings