import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
    children,
    defaultTheme = "light",
    storageKey = "vite-ui-theme",
    ...props
}: {
    children: React.ReactNode;
    defaultTheme?: "light" | "dark";
    storageKey?: string;
}) => {
    const [theme, setTheme] = useState(localStorage.getItem(storageKey) as "light" | "dark" || defaultTheme);
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark")
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: "light" | "dark") => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        }
    }
    return <ThemeContext.Provider {...props} value={value}>
        {children}
    </ThemeContext.Provider>;
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within an ThemeProvider");
    }
    return context;
}