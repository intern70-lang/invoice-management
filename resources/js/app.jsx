import "../css/app.css";
import "antd/dist/reset.css";

import AppProvider from "@/providers/AppProvider";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

import { ConfigProvider, theme } from "antd";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";

import { getAntdThemeConfig } from "@/config/antd.config";

function AntdWrapper({ children }) {
    const { theme: appTheme } = useTheme();

    return (
        <ConfigProvider theme={getAntdThemeConfig(appTheme)}>
            {children}
        </ConfigProvider>
    );
}

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });

        return pages[`./Pages/${name}.jsx`];
    },

    setup({ el, App, props }) {
        const root = el._reactRoot || createRoot(el);
        el._reactRoot = root;

        root.render(
            <ThemeProvider>
                <AntdWrapper>
                    <AppProvider>
                        <App {...props} />
                    </AppProvider>
                </AntdWrapper>
            </ThemeProvider>,
        );
    },
});
