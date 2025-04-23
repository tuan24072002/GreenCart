import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Logo } from "@/assets/icon";
import { useThemeContext } from "@/context/ThemeContext";
import { Link, NavLink, Outlet } from "react-router-dom";
import SellerLogin from "./SellerLogin";
import { useEffect } from "react";
import { setLogined, setUser } from "@/slice/app/App.slice";
import toast from "react-hot-toast";
import { AuthService } from "@/services/Auth.service";
import { ClipboardList, LayoutDashboard, ListOrdered, SquarePlus } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { resetStatus } from "@/slice/auth/Auth.slice";

const SellerLayout = () => {
    const { theme } = useThemeContext();
    const { navigate } = useAppContext();
    const dispatch = useAppDispatch();
    const appState = useAppSelector(state => state.app);
    const authState = useAppSelector(state => state.auth);

    const sidebarLinks = [
        { name: "Dashboard", path: "/seller", icon: <LayoutDashboard /> },
        { name: "Add Product", path: "/seller/add-product", icon: <SquarePlus /> },
        { name: "Product List", path: "/seller/product-list", icon: <ListOrdered /> },
        { name: "Orders", path: "/seller/orders", icon: <ClipboardList /> },
    ];
    const handleLogout = async () => {
        dispatch(setLogined(false));
        navigate("/")
        dispatch(setUser(null));
        AuthService.logout();
    }
    useEffect(() => {
        switch (authState.status) {
            case "completed":
                {
                    const localUser = localStorage.getItem('user');
                    const user = JSON.parse(localUser ?? '{}');
                    dispatch(setLogined(true));
                    dispatch(setUser(user));
                    if (user.isSeller) {
                        toast.success(authState.success ?? "Login successful!");
                    } else {
                        toast.error("This page is for sellers only!");
                    }
                    dispatch(resetStatus());
                }
                break
            case "failed":
                toast.error(authState.error ?? "Something went wrong !");
                dispatch(resetStatus());
                break
        }
    }, [dispatch, authState]);
    return (
        appState.user && appState.user?.isSeller ?
            <>
                <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3">
                    <Link to="/seller">
                        <Logo color={theme === "light" ? "#2B3441" : "#fff"} />
                    </Link>
                    <div className="flex items-center gap-5 text-muted-foreground">
                        <p>Hi! Seller</p>
                        <button
                            onClick={handleLogout}
                            className='border border-muted-foreground rounded-full text-sm px-4 py-1'>Logout</button>
                    </div>
                </div>
                <div className="flex h-[calc(100vh-55px)] overflow-hidden">
                    <div className="md:min-w-56 lg:min-w-64 min-w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                        {sidebarLinks.map((item) => (
                            <NavLink
                                to={item.path}
                                key={item.name}
                                end={item.path === "/seller"}
                                className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                        ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                        : "hover:bg-accent border-white"
                                    }`
                                }
                            >
                                {item.icon}
                                {/* <img src={} alt={item.name} className="size-7" /> */}
                                <p className="md:block hidden text-center">{item.name}</p>
                            </NavLink>
                        ))}
                    </div>
                    <Outlet />
                </div>
            </> : <SellerLogin />
    );
};

export default SellerLayout;