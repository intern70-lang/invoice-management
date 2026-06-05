import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => ({
        mode: localStorage.getItem("theme-mode") || "dark",
        primaryColor:
            localStorage.getItem("primary-color") ||
            "#1677ff",
        secondaryColor:
            localStorage.getItem("secondary-color") ||
            "#14b8a6",
    }));

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            theme.mode
        );

        document.documentElement.style.setProperty(
            "--primary",
            theme.primaryColor
        );

        document.documentElement.style.setProperty(
            "--secondary",
            theme.secondaryColor
        );

        localStorage.setItem(
            "theme-mode",
            theme.mode
        );

        localStorage.setItem(
            "primary-color",
            theme.primaryColor
        );

        localStorage.setItem(
            "secondary-color",
            theme.secondaryColor
        );
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () =>
    useContext(ThemeContext);