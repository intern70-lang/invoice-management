// resources/js/context/ThemeContext.jsx
import {
    createContext,
    useContext,
    useState,
    useCallback,
} from "react";

const ThemeContext = createContext();

function applyToDom({ mode, primaryColor, secondaryColor }) {
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--secondary", secondaryColor);
}

function persist({ mode, primaryColor, secondaryColor }) {
    localStorage.setItem("theme-mode", mode);
    localStorage.setItem("primary-color", primaryColor);
    localStorage.setItem("secondary-color", secondaryColor);
}

function fromSettings(settings) {
    return {
        mode:
            settings?.theme_mode ||
            localStorage.getItem("theme-mode") ||
            "dark",
        primaryColor:
            settings?.primary_color ||
            localStorage.getItem("primary-color") ||
            "#467CD5",
        secondaryColor:
            settings?.secondary_color ||
            localStorage.getItem("secondary-color") ||
            "#14b8a6",
        currencySymbol: settings?.currency_symbol || "£",
        currencyCode: settings?.currency_code || "GBP",
        appName: settings?.app_name || "InvoiceApp",
        logo: settings?.logo || null,
    };
}

export function ThemeProvider({ children, initialSettings }) {
    const [theme, setThemeState] = useState(() => {
        const t = fromSettings(initialSettings);
        applyToDom(t);
        persist(t);
        return t;
    });

    const syncFromSettings = useCallback((settings) => {
        const t = fromSettings(settings);
        setThemeState(t);
        applyToDom(t);
        persist(t);
    }, []);

    // Now also persists so refresh keeps the toggled mode
    const previewTheme = useCallback((patch) => {
        setThemeState((prev) => {
            const next = { ...prev, ...patch };
            applyToDom(next);
            persist(next);       // ← was missing
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, syncFromSettings, previewTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
