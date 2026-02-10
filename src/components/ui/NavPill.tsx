import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Palette, Wand2, RefreshCcw, Image, Sun, Moon, Layout, ChevronDown, LayoutGrid } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function NavPill() {
    const { theme, toggleTheme } = useTheme();
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const toolsRef = useRef<HTMLDivElement>(null);

    const primaryLinks = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/logo-studio', icon: Palette, label: 'Logo Studio' },
        { to: '/editor', icon: Image, label: 'Editor' },
        { to: '/thumbnail-maker', icon: Layout, label: 'Thumbnail' },
    ];

    const secondaryLinks = [
        { to: '/vectorizer', icon: Wand2, label: 'Vectorizer' },
        { to: '/converter', icon: RefreshCcw, label: 'Converter' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
                setIsToolsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-8 inset-x-0 mx-auto w-fit z-50 flex items-center gap-2 p-2 bg-surface/50 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-full "
        >
            <div className="flex items-center gap-1">
                {/* Primary Links */}
                {primaryLinks.map(({ to, icon: Icon, label }) => (
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

                {/* Secondary Links - Desktop only */}
                <div className="hidden lg:flex items-center gap-1">
                    {secondaryLinks.map(({ to, icon: Icon, label }) => (
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

                {/* More Tools Dropdown - Mobile only */}
                <div className="lg:hidden relative" ref={toolsRef}>
                    <button
                        onClick={() => setIsToolsOpen(!isToolsOpen)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                            isToolsOpen || secondaryLinks.some(link => window.location.pathname.endsWith(link.to))
                                ? 'bg-text-main/10 text-text-main'
                                : 'text-text-muted hover:text-text-main hover:bg-white/5'
                        )}
                    >
                        <LayoutGrid size={16} />
                        <span className="hidden sm:inline">Tools</span>
                        <ChevronDown size={14} className={cn('transition-transform duration-300', isToolsOpen && 'rotate-180')} />
                    </button>

                    <AnimatePresence>
                        {isToolsOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute top-full right-0 mt-2 p-2 min-w-[160px] bg-surface/90 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col gap-1"
                            >
                                {secondaryLinks.map(({ to, icon: Icon, label }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        onClick={() => setIsToolsOpen(false)}
                                        className={({ isActive }) =>
                                            cn(
                                                'flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                                                isActive
                                                    ? 'bg-text-main text-bg'
                                                    : 'text-text-muted hover:text-text-main hover:bg-white/5'
                                            )
                                        }
                                    >
                                        <Icon size={16} />
                                        <span>{label}</span>
                                    </NavLink>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

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
