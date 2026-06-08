// resources/js/context/ThemeContext.jsx
//
// Accepts initialSettings from app.jsx (bootstrapped from Inertia page props).
// After that, syncFromSettings() is called on save success to update the app.
// previewTheme() gives instant DOM updates while editing in Settings.jsx.
// Header.jsx uses previewTheme({ mode }) for the quick toggle button.

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

const ThemeContext = createContext();

// ── DOM helpers ───────────────────────────────────────────────────────────────
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

// ── Map raw settings object → theme shape ─────────────────────────────────────
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

// ── Provider ──────────────────────────────────────────────────────────────────
export function ThemeProvider({ children, initialSettings }) {
    const [theme, setThemeState] = useState(() => {
        const t = fromSettings(initialSettings);
        applyToDom(t);
        persist(t);
        return t;
    });

    // Called by Settings.jsx after a successful save — updates whole app
    const syncFromSettings = useCallback((settings) => {
        const t = fromSettings(settings);
        setThemeState(t);
        applyToDom(t);
        persist(t);
    }, []);

    // Live preview while the user edits (instant, before saving)
    const previewTheme = useCallback((patch) => {
        setThemeState((prev) => {
            const next = { ...prev, ...patch };
            applyToDom(next);
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider
            value={{ theme, syncFromSettings, previewTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
