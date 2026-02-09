import { Link, useLocation } from 'react-router-dom';
import { Home, PenTool, Image, Layers, Scissors, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Features', path: '/features', icon: Layers },
    { name: 'Logo Studio', path: '/logo-studio', icon: PenTool },
    { name: 'Vector Pro', path: '/vectorizer', icon: Image },
    { name: 'Batch Converter', path: '/converter', icon: Layers },
    { name: 'Image Editor', path: '/editor', icon: Scissors },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 h-full w-64 bg-surface backdrop-blur-xl border-r border-border z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <span className="font-heading font-bold text-xl tracking-tight">Kenichi.</span>
                    <button onClick={onClose} className="md:hidden p-1 text-text-muted hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 flex-grow">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose()} // Close on mobile navigation
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-accent/10 text-accent font-medium shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                                        : "text-text-muted hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-accent" : "text-text-muted group-hover:text-white")} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <ThemeToggle />
                </div>
            </aside>
        </>
    );
}
