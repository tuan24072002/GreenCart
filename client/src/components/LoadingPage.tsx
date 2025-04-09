import { Logo } from "@/assets/icon"
import { useThemeContext } from "@/context/ThemeContext"

const LoadingPage = () => {
    const { theme } = useThemeContext();
    return (
        <div className='w-screen h-screen flex items-center justify-center absolute top-0 left-0 z-50'>
            <Logo color={theme === "light" ? "#2B3441" : "#fff"} width={300} height={300} />
        </div>
    )
}

export default LoadingPage