import { usePage } from '@inertiajs/react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';

export default function AppLayout({ title, children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-[#0f1117] text-slate-200">
            <Sidebar user={auth.user} />

            <div className="ml-[240px] min-h-screen flex flex-col">
                <Header title={title} user={auth.user} />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}