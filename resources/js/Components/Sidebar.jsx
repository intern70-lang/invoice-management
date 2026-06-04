import { Link, usePage } from '@inertiajs/react';

export default function Sidebar({ user }) {
    const url = usePage().url;

    const adminLinks = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Invoices', href: '/admin/invoices' },
        { label: 'Customers', href: '/admin/customers' },
        { label: 'Products', href: '/admin/products' },
        { label: 'Categories', href: '/admin/categories' },
        { label: 'Settings', href: '/admin/settings' },
    ];

    const agentLinks = [
        { label: 'Dashboard', href: '/agent/dashboard' },
        { label: 'Invoices', href: '/agent/invoices' },
    ];

    const links = user?.role === 'admin'
        ? adminLinks
        : agentLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#161b27] border-r border-[#1e2535] flex flex-col">
            <div className="p-5 border-b border-[#1e2535]">
                <h2 className="font-semibold">
                    InvoiceApp
                </h2>
            </div>

            <nav className="flex-1 p-3 space-y-1">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-3 py-2 rounded text-sm ${
                            url.startsWith(link.href)
                                ? 'bg-[#252d3f] text-blue-400'
                                : 'text-slate-400 hover:bg-[#252d3f]'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="p-3 border-t border-[#1e2535]">
                <div className="text-sm">
                    {user?.name}
                </div>

                <div className="text-xs text-slate-500 capitalize">
                    {user?.role}
                </div>
            </div>
        </aside>
    );
}