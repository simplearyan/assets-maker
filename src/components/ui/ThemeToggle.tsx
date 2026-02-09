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
        <div className="flex items-center gap-1 p-1.5 bg-bg/50 border border-border rounded-full w-full relative">
            <button
                onClick={() => setTheme('light')}
                className={cn(
                    "flex-1 p-2 rounded-full transition-all duration-300 flex items-center justify-center relative z-10",
                    theme === 'light'
                        ? "text-black bg-white shadow-sm ring-1 ring-black/5"
                        : "text-text-muted hover:text-text-main"
                )}
                title="Light Mode"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={cn(
                    "flex-1 p-2 rounded-full transition-all duration-300 flex items-center justify-center relative z-10",
                    theme === 'system'
                        ? "text-accent bg-accent/10 font-medium"
                        : "text-text-muted hover:text-text-main"
                )}
                title="System Preference"
            >
                <Laptop className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={cn(
                    "flex-1 p-2 rounded-full transition-all duration-300 flex items-center justify-center relative z-10",
                    theme === 'dark'
                        ? "text-white bg-slate-800 shadow-sm ring-1 ring-white/10"
                        : "text-text-muted hover:text-text-main"
                )}
                title="Dark Mode"
            >
                <Moon className="w-4 h-4" />
            </button>
        </div>
    );
}
