import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "antd";
import {
    LayoutDashboard,
    FileText,
    Users,
    Package,
    Tags,
    Settings,
    LogOut,
    Receipt,
    Factory,
    Truck,
    MapPin,
} from "lucide-react";

const adminMenu = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        active: ["admin/dashboard"],
    },
    {
        label: "Invoices",
        href: "/admin/invoices",
        icon: FileText,
        active: ["admin/invoices"],
    },
    {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
        active: ["admin/customers"],
    },
    {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        active: ["admin/products"],
    },
    {
        label: "Categories",
        href: "/admin/categories",
        icon: Tags,
        active: ["admin/categories"],
    },
    {
        label: "Areas",
        href: "/admin/areas",
        icon: MapPin,
        active: ["admin/areas"],
    },
    {
        label: "Manufacturers",
        href: "/admin/manufacturers",
        icon: Factory,
        active: ["admin/manufacturers"],
    },
    {
        label: "Vendors",
        href: "/admin/vendors",
        icon: Truck,
        active: ["admin/vendors"],
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        active: ["admin/settings"],
    },
];

const agentMenu = [
    {
        label: "Dashboard",
        href: "/agent/dashboard",
        icon: LayoutDashboard,
        active: ["agent/dashboard"],
    },
    {
        label: "Invoices",
        href: "/agent/invoices",
        icon: FileText,
        active: ["agent/invoices"],
    },
];

export default function Sidebar({ collapsed }) {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;

    const user = auth?.user;

    const menu = user?.role === "admin" ? adminMenu : agentMenu;

    const handleLogout = () => {
        if (!window.confirm("Are you sure you want to logout?")) {
            return;
        }

        router.post("/logout");
    };

    return (
        <aside
            className={`
                fixed
                top-0
                left-0
                h-screen
                bg-(--bg-secondary)
                border-r
                border-(--border-color)
                flex
                flex-col
                z-40
                overflow-hidden
                transition-all
                duration-300
                ${collapsed ? "w-16" : "w-60"}
            `}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-(--border-color) min-h-[65px]">
                <div className="w-8 h-8 rounded-lg bg-(--primary) flex items-center justify-center shrink-0">
                    <Receipt size={16} className="text-white" />
                </div>

                {!collapsed && (
                    <span className="font-semibold text-(--text-primary) text-sm whitespace-nowrap">
                        InvoiceApp
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
                {menu.map((item) => {
                    const Icon = item.icon;

                    const isActive = item.active.some((route) =>
                        currentUrl.includes(route),
                    );

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex
                                items-center
                                gap-3
                                px-3
                                py-2.5
                                rounded-lg
                                transition-all
                                text-sm
                                ${isActive
                                    ? "bg-(--primary)! text-white!"
                                    : "text-(--text-primary)! bg-(--text-primary)/5! hover:text-(--text-primary)! hover:bg-(--text-primary)/20!"
                                }
                            `}
                            title={collapsed ? item.label : ""}
                        >
                            <Icon size={18} className="shrink-0" />

                            {!collapsed && (
                                <span className="whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-(--border-color)">
                <div
                    className={`
                        flex
                        items-center
                        gap-3
                        px-2
                        py-2
                    `}
                >
                    <div className="w-8 h-8 rounded-full bg-(--primary) flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-(--text-primary) truncate mb-0.5!">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-(--text-secondary) capitalize mb-1!">
                                    {user?.role}
                                </p>
                            </div>

                            <Button
                                onClick={handleLogout}
                                color="default" variant="filled"
                                size="small"
                                className=" text-(--text-secondary) hover:text-(--text-primary)"
                                title="Logout"
                            >
                                <LogOut size={14} />
                            </Button>
                        </>
                    )}

                    {collapsed && (
                        <button
                            onClick={handleLogout}
                            className="ml-auto text-(--text-secondary) hover:text-(--text-primary)"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
