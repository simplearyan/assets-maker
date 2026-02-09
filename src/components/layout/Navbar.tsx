import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const location = useLocation();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('light', savedTheme === 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('light', newTheme === 'light');
    };

    return (
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-8 py-3 bg-surface/60 backdrop-blur-md border border-border rounded-full shadow-lg">
            <Link to="/" className="font-heading font-extrabold text-lg tracking-tight">
                Kenichi.
            </Link>

            <div className="flex items-center gap-6">
                <Link
                    to="/"
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-text-main",
                        location.pathname === '/' ? "text-text-main" : "text-text-muted"
                    )}
                >
                    Home
                </Link>
                <span className={cn(
                    "text-sm font-medium transition-colors hover:text-text-main cursor-pointer",
                    "text-text-main" // Active for now as this IS the tools app
                )}>
                    Tools
                </span>
                <span className="text-sm font-medium text-text-muted cursor-not-allowed opacity-50">
                    Downloads
                </span>
            </div>

            <button
                onClick={toggleTheme}
                className="text-text-main hover:text-accent transition-colors"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        </nav>
    );
}
