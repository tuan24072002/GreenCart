import ChangePassword from "@/components/Settings/ChangePassword";
import General from "@/components/Settings/General";
import Language from "@/components/Settings/Language";
import { Languages, LayoutDashboard, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Settings = () => {
    const location = useLocation();
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
    return (
        <div className="flex">
            <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                {sidebarLinks.map((item, index) => (
                    <Link to={item.path} key={index}
                        className={`flex items-center py-3 px-4 gap-3 
                            ${location.pathname === item.path ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                : "hover:bg-accent border-white text-accent-foreground"
                            }`
                        }
                    >
                        {item.icon}
                        <p className="md:block hidden text-center">{item.name}</p>
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