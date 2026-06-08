// resources/js/app.jsx
import "../css/app.css";
import "antd/dist/reset.css";

import { useMemo } from "react";
import AppProvider from "@/providers/AppProvider";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { getAntdThemeConfig } from "@/config/antd.config";

// ── AntdWrapper ───────────────────────────────────────────────────────────────
// Must sit INSIDE ThemeProvider to read context.
// useMemo ensures ConfigProvider only gets a new theme object when
// secondaryColor or mode actually changes — this is required for AntD's
// internal style cache to work correctly and re-derive its token palette.
function AntdWrapper({ children }) {
    const { theme: appTheme } = useTheme();

    const antdTheme = useMemo(
        () => getAntdThemeConfig(appTheme),
        // Depend on the exact values that affect the config, not the object ref
        [appTheme.mode, appTheme.secondaryColor],
    );

    return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
}

// ── Root ──────────────────────────────────────────────────────────────────────
// ThemeProvider bootstraps from initialSettings passed directly from
// Inertia's page props — no usePage() needed at the root level.
createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },

    setup({ el, App, props }) {
        const root = el._reactRoot || createRoot(el);
        el._reactRoot = root;

        const initialSettings = props.initialPage?.props?.settings ?? null;

        root.render(
            <ThemeProvider initialSettings={initialSettings}>
                <AntdWrapper>
                    <AppProvider>
                        <App {...props} />
                    </AppProvider>
                </AntdWrapper>
            </ThemeProvider>,
        );
    },
});

// import "../css/app.css";
// import "antd/dist/reset.css";

// import AppProvider from "@/providers/AppProvider";

// import { createInertiaApp } from "@inertiajs/react";
// import { createRoot } from "react-dom/client";

// import { ConfigProvider, theme } from "antd";

// import { ThemeProvider, useTheme } from "@/context/ThemeContext";

// import { getAntdThemeConfig } from "@/config/antd.config";

// function AntdWrapper({ children }) {
//     const { theme: appTheme } = useTheme();

//     return (
//         <ConfigProvider theme={getAntdThemeConfig(appTheme)}>
//             {children}
//         </ConfigProvider>
//     );
// }

// createInertiaApp({
//     resolve: (name) => {
//         const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });

//         return pages[`./Pages/${name}.jsx`];
//     },

//     setup({ el, App, props }) {
//         const root = el._reactRoot || createRoot(el);
//         el._reactRoot = root;

//         root.render(
//             <ThemeProvider>
//                 <AntdWrapper>
//                     <AppProvider>
//                         <App {...props} />
//                     </AppProvider>
//                 </AntdWrapper>
//             </ThemeProvider>,
//         );
//     },
// });
