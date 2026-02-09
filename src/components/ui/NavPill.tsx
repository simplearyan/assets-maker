import { NavLink } from 'react-router-dom';
import { Home, Palette, Wand2, RefreshCcw, Image, Sun, Moon, Layout } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function NavPill() {
    const { theme, toggleTheme } = useTheme();

    const links = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/logo-studio', icon: Palette, label: 'Logo Studio' },
        { to: '/vectorizer', icon: Wand2, label: 'Vectorizer' },
        { to: '/converter', icon: RefreshCcw, label: 'Converter' },
        { to: '/editor', icon: Image, label: 'Editor' },
        { to: '/thumbnail-maker', icon: Layout, label: 'Thumbnail' },
    ];

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-8 inset-x-0 mx-auto w-fit z-50 flex items-center gap-2 p-2 bg-surface/50 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-full shadow-2xl"
        >
            <div className="flex items-center gap-1">
                {links.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                                isActive
                                    ? 'bg-text-main text-bg shadow-lg'
                                    : 'text-text-muted hover:text-text-main hover:bg-white/5'
                            )
                        }
                    >
                        <Icon size={16} />
                        <span className="hidden sm:inline">{label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="w-px h-6 bg-white/10 mx-2" />

            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-white/5 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        </motion.nav>
    );
}
