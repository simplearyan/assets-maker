import { Outlet, useLocation } from 'react-router-dom';
import { NavPill } from '../ui/NavPill';
import { cn } from '../../lib/utils';

export function Layout() {
    const location = useLocation();
    const isFullWidth = ['/thumbnail-maker', '/logo-studio', '/editor'].some(path => location.pathname.endsWith(path));

    return (
        <div className="min-h-screen relative font-sans text-text-main selection:bg-accent/30 selection:text-zinc-900 dark:selection:text-white overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-[-1] bg-bg transition-colors duration-500" />
            <div className="bg-grid opacity-[0.4] dark:opacity-[0.2]" />
            <div className="bg-mesh" />

            {/* Navigation */}
            <NavPill />

            {/* Main Content */}
            <main
                className={cn(
                    "relative z-10 pt-24 min-h-screen flex flex-col",
                    isFullWidth ? "px-0 md:px-4" : "pb-12 px-4 md:px-8 max-w-7xl mx-auto"
                )}
            >
                <Outlet />
            </main>
        </div>
    );
}
