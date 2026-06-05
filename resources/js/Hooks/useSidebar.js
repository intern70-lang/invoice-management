import { useEffect, useState } from 'react';

export default function useSidebar() {
    const [collapsed, setCollapsed] = useState(() => {
        return (
            localStorage.getItem(
                'sidebar-collapsed'
            ) === 'true'
        );
    });

    useEffect(() => {
        localStorage.setItem(
            'sidebar-collapsed',
            collapsed
        );
    }, [collapsed]);

    return {
        collapsed,
        toggleSidebar: () =>
            setCollapsed((prev) => !prev),
    };
}