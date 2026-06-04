export default function Header({ title }) {
    return (
        <header className="h-[73px] bg-[#161b27] border-b border-[#1e2535] px-6 flex items-center">
            <h1 className="text-sm font-semibold text-white">
                {title}
            </h1>
        </header>
    );
}