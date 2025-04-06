import { useRef, useState } from "react"
import { NavLink } from "react-router-dom";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { X } from "lucide-react";
import { CSSTransition } from "react-transition-group";

const Navbar = () => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
    const { user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount } = useAppContext();

    const handleLogout = async () => {
        setUser(null);
        navigate("/");
    }

    return (
        <div className="flex flex-col">
            <CSSTransition
                nodeRef={nodeRef}
                in={showBanner}
                timeout={500}
                classNames="banner"
                unmountOnExit
            >
                <div ref={nodeRef} className="w-full py-2.5 font-medium text-sm text-white text-center bg-gradient-to-r from-violet-500 via-[#9938CA] to-[#E0724A] relative md:block hidden">
                    <p>Special Deal: Free Shipping on Orders Above 50,000vnđ! | 20% OFF on First Purchase</p>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 text-black hover:text-red-500"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            </CSSTransition>
            <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

                <NavLink to={"/"} onClick={() => setOpen(false)}>
                    <img className="h-9" src={assets.logo} alt="dummyLogoColored" />
                </NavLink>
                <div className="hidden sm:flex items-center gap-8">
                    <NavLink to={"/"}>Home</NavLink>
                    <NavLink to={"/products"}>Products</NavLink>
                    <NavLink to={"/contact"}>Contact</NavLink>

                    <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                        <input
                            onChange={(e) => {
                                if (e.target.value.length > 0) {
                                    navigate("/products");
                                }
                                setSearchQuery(e.target.value);
                            }}
                            value={searchQuery}
                            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                            type="text"
                            placeholder="Search products" />
                        <img src={assets.search_icon} alt="Search" className="size-4" />
                    </div>

                    <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                        <img src={assets.nav_cart_icon} alt="Cart" className="w-6 opacity-80" />
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                    </div>

                    {
                        user ?
                            <div className="relative group">
                                <img src={assets.profile_icon} alt="Profile" className="w-10" />
                                <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 w-40 py-2.5 rounded-md text-sm z-40">
                                    <li className="p-1.5 pl-3 text-sm">Hello, <span className="text-primary font-semibold">{user.name}</span></li>
                                    <hr className="border-gray-200" />
                                    <li
                                        onClick={() => navigate("/my-orders")}
                                        className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                                    >My Orders</li>
                                    <li
                                        className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                                        onClick={handleLogout}
                                    >Logout</li>
                                </ul>
                            </div> :
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setShowUserLogin(true);
                                }}
                                className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                                Login
                            </button>
                    }
                </div>

                <div className="flex items-center gap-6 sm:hidden">
                    <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                        <img src={assets.nav_cart_icon} alt="Cart" className="w-6 opacity-80" />
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                    </div>
                    <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu">
                        <img src={assets.menu_icon} alt="Menu" className="w-6" />
                    </button>
                </div>
                {
                    open &&
                    <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                        <NavLink to={"/"} onClick={() => setOpen(false)}>Home</NavLink>
                        <NavLink to={"/products"} onClick={() => setOpen(false)}>Products</NavLink>
                        {
                            user &&
                            <NavLink to={"/my-orders"} onClick={() => setOpen(false)}>My Orders</NavLink>
                        }
                        <NavLink to={"/contact"} onClick={() => setOpen(false)}>Contact</NavLink>
                        {
                            user ?
                                <button onClick={handleLogout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                                    Logout
                                </button> :
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        setShowUserLogin(true);
                                    }}
                                    className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                                    Login
                                </button>
                        }
                    </div>
                }

            </nav>
        </div>
    )
}
export default Navbar;