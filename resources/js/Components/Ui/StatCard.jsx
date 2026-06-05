export default function StatCard({
    title,
    value,
    icon: Icon,
    iconColor = 'text-blue-400',
}) {
    return (
        <div className="card p-4">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                    <Icon
                        size={18}
                        className={iconColor}
                    />
                </div>

                <div>
                    <p className="text-xs text-slate-500">
                        {title}
                    </p>

                    <p className="text-lg font-semibold text-white">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}