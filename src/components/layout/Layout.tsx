import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function Layout() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-bg text-text-main font-sans selection:bg-accent/30 selection:text-white">
            <div className="bs-mesh fixed inset-0 z-0 pointer-events-none opacity-20" />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-lg border-b border-border z-40 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-white to-gray-400" />
                    <span className="font-heading font-bold text-sm">Assets Maker</span>
                </div>
                <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
                    <Menu className="w-6 h-6 text-white" />
                </button>
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="md:ml-64 min-h-screen relative z-10 pt-20 md:pt-0 transition-all duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-12">
                    <Outlet />
                </div>
            </main>

            {/* Mesh Background style injected here or in index.css */}
            <style>{`
        .bs-mesh {
            background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.05) 0%, transparent 30%);
        }
      `}</style>
        </div>
    );
}
