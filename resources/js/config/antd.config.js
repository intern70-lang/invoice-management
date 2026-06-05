import { Form, Input, theme } from "antd";

export const getAntdThemeConfig = (appTheme) => {
    const isDark = appTheme.mode === "dark";

    return {
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: appTheme.primaryColor,
            colorInfo: appTheme.primaryColor,
            
            // Sync Antd Backgrounds with Tailwind Theme
            colorBgBase: isDark ? "#030712" : "#ffffff",
            colorBgContainer: isDark ? "#111827" : "#ffffff",
            colorBgElevated: isDark ? "#1f2937" : "#ffffff",
            colorBgLayout: isDark ? "#030712" : "#f5f5f5",

            // Sync Antd Text Colors with Tailwind Theme
            colorTextBase: isDark ? "#f8fafc" : "#111827",
            colorTextSecondary: isDark ? "#94a3b8" : "#6b7280",

            // Sync Borders
            colorBorder: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
            colorBorderSecondary: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",

            borderRadius: 8,
            fontFamily: "'Instrument Sans', sans-serif",
        },
        components: {
            Form: {
                variant: "filled", // 🔥 THIS is the real switch
            },
            Select: {
                variant: "filled",
            },

            Dropdown: {
                colorBgElevated: isDark ? "#111827" : "#ffffff",
            },
            Menu: {
                colorBgContainer: isDark ? "#111827" : "#ffffff",
                colorItemBg: isDark ? "#111827" : "#ffffff",
                colorItemBgHover: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
            },
            Layout: {
                bodyBg: isDark ? "#030712" : "#ffffff",
                headerBg: isDark ? "#111827" : "#f5f5f5",
            },
}
    };
};
