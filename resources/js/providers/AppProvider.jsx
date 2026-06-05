import { ConfigProvider, theme } from "antd";

export default function AppProvider({ children }) {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,

                token: {
                    colorPrimary: "#4f8ef7",
                    borderRadius: 8,
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}