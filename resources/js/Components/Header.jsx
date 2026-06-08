// resources/js/Layouts/Header.jsx
import { Layout, Button, Typography, Avatar, Dropdown } from "antd";
import {
    PanelLeftClose,
    PanelLeftOpen,
    Bell,
    User,
    LogOut,
    Settings,
    Moon,
    Sun,
} from "lucide-react";
import { router } from "@inertiajs/react";
import { useTheme } from "@/context/ThemeContext";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export default function Header({ title, collapsed, onToggleSidebar }) {
    const { theme, previewTheme } = useTheme();

    const toggleTheme = () => {
        previewTheme({ mode: theme.mode === "dark" ? "light" : "dark" });
    };

    const items = [
        {
            key: "theme",
            label: theme.mode === "dark" ? "Light Mode" : "Dark Mode",
            icon:
                theme.mode === "dark" ? <Sun size={16} /> : <Moon size={16} />,
        },
        {
            key: "settings",
            label: "Settings",
            icon: <Settings size={16} />,
        },
        { type: "divider" },
        {
            key: "logout",
            label: "Logout",
            danger: true,
            icon: <LogOut size={16} />,
        },
    ];

    const handleMenuClick = ({ key }) => {
        if (key === "theme") {
            toggleTheme();
            return;
        }
        if (key === "settings") {
            router.visit("/admin/settings");
            return;
        }
        if (key === "logout") {
            router.post("/logout");
        }
    };

    return (
        <AntHeader
            style={{
                height: 73,
                padding: "0 24px",
                background: "var(--bg-secondary)",
                borderBottom:
                    "1px solid var(--border-color, rgba(128,128,128,0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "absolute",
                right: 0,
                top: 0,
                zIndex: 10,
                width: "100%"
            }}
        >
            {/* Left: sidebar toggle + page title */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Button
                    type="text"
                    onClick={onToggleSidebar}
                    icon={
                        collapsed ? (
                            <PanelLeftOpen size={18} />
                        ) : (
                            <PanelLeftClose size={18} />
                        )
                    }
                />
                <Title
                    level={4}
                    style={{ margin: 0, color: "var(--text-primary)" }}
                >
                    {title}
                </Title>
            </div>

            {/* Right: theme toggle, bell, avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Button
                    type="text"
                    onClick={toggleTheme}
                    icon={
                        theme.mode === "dark" ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )
                    }
                />

                <Button type="text" icon={<Bell size={18} />} />

                <Dropdown
                    menu={{ items, onClick: handleMenuClick }}
                    trigger={["click"]}
                >
                    <Avatar
                        style={{
                            cursor: "pointer",
                            background: "var(--primary)",
                        }}
                        icon={<User size={16} />}
                    />
                </Dropdown>
            </div>
        </AntHeader>
    );
}
