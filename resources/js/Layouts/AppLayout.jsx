import { useEffect, useState } from "react";
import { Layout, notification } from "antd";
import { usePage } from "@inertiajs/react";

import Sidebar from "@/Components/Sidebar";
import Header from "@/Components/Header";

const { Sider, Content } = Layout;

export default function AppLayout({ title, children }) {
    const [api, contextHolder] = notification.useNotification();
    const { flash } = usePage().props;

    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebar-collapsed") === "true",
    );

    const toggleSidebar = () => {
        const value = !collapsed;
        setCollapsed(value);
        localStorage.setItem("sidebar-collapsed", value);
    };

    // Show flash toast whenever Inertia navigates and flash is set
    useEffect(() => {
        if (flash?.success) {
            api.success({
                title: "Success",
                description: flash.success,
                placement: "topRight",
                duration: 3,
            });
        }
        if (flash?.error) {
            api.error({
                title: "Error",
                description: flash.error,
                placement: "topRight",
                duration: 4,
            });
        }
    }, [flash]);

    return (
        <Layout
            style={{
                minHeight: "100vh",
                background: "var(--bg-primary)",
            }}
        >
            {contextHolder}

            <Sider
                collapsible
                collapsed={collapsed}
                trigger={null}
                width={240}
                collapsedWidth={64}
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: "var(--bg-secondary)",
                    borderRight:
                        "1px solid var(--border-color, rgba(128,128,128,0.2))",
                }}
            >
                <Sidebar collapsed={collapsed} />
            </Sider>

            <Layout
                style={{
                    marginLeft: collapsed ? 64 : 240,
                    transition: "all 0.2s ease",
                    background: "var(--bg-primary)",
                    position: "relative",
                }}
            >
                <Header
                    title={title}
                    collapsed={collapsed}
                    onToggleSidebar={toggleSidebar}
                />

                <Content
                    style={{
                        padding: 24,
                        marginTop: 73,
                        background: "var(--bg-primary)",
                        color: "var(--text-primary)",
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
