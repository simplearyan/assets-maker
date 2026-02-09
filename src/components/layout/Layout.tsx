import { Outlet } from 'react-router-dom';
import { NavPill } from '../ui/NavPill';

export function Layout() {
    return (
        <div className="min-h-screen relative font-sans text-text-main selection:bg-accent/30 selection:text-zinc-900 dark:selection:text-white overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-[-1] bg-bg transition-colors duration-500" />
            <div className="bg-mesh" />

            {/* Navigation */}
            <NavPill />

            {/* Main Content */}
            <main className="relative z-10 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex flex-col">
                <Outlet />
            </main>
        </div>
    );
}
