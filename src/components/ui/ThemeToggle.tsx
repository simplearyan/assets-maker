import { Moon, Sun, Laptop } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex items-center gap-1 p-1 bg-surface-card border border-border rounded-lg">
            <button
                onClick={() => setTheme('light')}
                className={cn(
                    "p-2 rounded-md transition-all duration-200",
                    theme === 'light' ? "bg-white text-black shadow-sm" : "text-text-muted hover:text-text-main"
                )}
                title="Light Mode"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={cn(
                    "p-2 rounded-md transition-all duration-200",
                    theme === 'system' ? "bg-accent/20 text-accent font-medium" : "text-text-muted hover:text-text-main"
                )}
                title="System Preference"
            >
                <Laptop className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={cn(
                    "p-2 rounded-md transition-all duration-200",
                    theme === 'dark' ? "bg-zinc-800 text-white shadow-sm" : "text-text-muted hover:text-text-main"
                )}
                title="Dark Mode"
            >
                <Moon className="w-4 h-4" />
            </button>
        </div>
    );
}
