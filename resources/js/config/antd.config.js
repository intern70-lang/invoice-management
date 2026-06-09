import { theme } from "antd";

export const getAntdThemeConfig = (appTheme) => {
    const isDark = appTheme.mode === "dark";
    const secondary = appTheme.secondaryColor;

    // Derive simple hover/active shades from secondaryColor
    // AntD's algorithm would do this automatically but we override Button tokens directly
    const toRgba = (hex, opacity) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${opacity})`;
    };

    // Slightly darken for hover/active — simple brightness shift via opacity over white/black
    const hoverBg = secondary + "dd"; // ~87% opacity approximation
    const activeBg = secondary + "bb"; // ~73% opacity approximation

    return {
        cssVar: false,
        hashed: true,

        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,

        token: {
            // colorPrimary drives Switch, Checkbox, Radio, Select focus ring,
            // DatePicker highlights, Pagination active, Progress, Spin etc.
            colorPrimary: secondary,
            colorInfo: secondary,
            colorLink: secondary,

            // Backgrounds
            colorBgBase: isDark ? "#141414" : "#F5F6F6",
            colorBgContainer: isDark ? "#141414" : "#ffffff",
            // colorBgElevated: isDark ? "#1f2937" : "#ffffff",
            // colorBgLayout: isDark ? "#030712" : "#f5f5f5",

            // Text
            colorTextBase: isDark ? "#f8fafc" : "#111827",
            colorTextSecondary: isDark ? "#94a3b8" : "#6b7280",
            colorTextLightSolid: "#ffffff",

            // Borders
            colorBorder:
                isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            colorBorderSecondary:
                isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",

            borderRadius: 8,
            fontFamily: "'Instrument Sans', sans-serif",
        },

        components: {
            // ── Button ────────────────────────────────────────────────────────
            // In v6, color="primary" (type="primary") uses its own preset scale.
            // Override solidBg / solidHoverBg / solidActiveBg directly to apply
            // our secondaryColor to ALL solid primary buttons globally.
            Button: {
                colorPrimary: secondary,      // base token for derivation
                solidBg: secondary,      // solid button background ✅
                solidHoverBg: hoverBg,        // hover state
                solidActiveBg: activeBg,       // active/pressed state
                primaryShadow: "none",         // remove colored glow shadow
                primaryColor: "#ffffff",      // text on primary solid button
                algorithm: true,
            },

            Switch: {
                colorPrimary: secondary,      // base token for derivation
                solidBg: secondary,      // solid button background ✅
                solidHoverBg: hoverBg,        // hover state
                solidActiveBg: activeBg,       // active/pressed state
                primaryShadow: "none",         // remove colored glow shadow
                primaryColor: "#ffffff",      // text on primary solid button
                algorithm: true,
            },

            // ── Other interactive components ─────────────────────────────────
            // Switch: { algorithm: true },
            Checkbox: { algorithm: true },
            Radio: { algorithm: true },
            Select: { algorithm: true, variant: "filled" },
            Form: { variant: "filled" },

            Dropdown: {
                colorBgElevated: isDark ? "#1D1D1D" : "#ffffff",
            },
            // Menu: {
            //     colorBgContainer: isDark ? "#111827" : "#ffffff",
            //     colorItemBg:      isDark ? "#111827" : "#ffffff",
            //     colorItemBgHover:
            //         isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
            // },
            Layout: {
                bodyBg: isDark ? "#030712" : "#ffffff",
                headerBg: isDark ? "#111827" : "#f5f5f5",
            },
        },
    };
};
