import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wand2, Layers, Image, PenTool, Scissors } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export function Features() {
    const navigate = useNavigate();

    return (
        <div className="space-y-16">
            <header className="space-y-6 text-center pt-10 pb-6">
                <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight">
                    Create <span className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Anything</span>.
                </h1>
                <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                    Your browser-based studio for rapid asset generation.
                </p>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto auto-rows-[350px]"
            >
                {/* 1. Logo Maker (2x2) */}
                <motion.div
                    variants={item}
                    onClick={() => navigate('/logo-studio')}
                    className="glass-card col-span-1 md:col-span-2 lg:col-span-2 row-span-2 p-10 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                >
                    <div className="relative z-10">
                        <div className="p-3 bg-accent/10 w-fit rounded-2xl mb-4 group-hover:bg-accent/20 transition-colors">
                            <PenTool className="w-8 h-8 text-accent" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2">Logo Studio</h3>
                        <p className="text-lg text-text-muted">Design SVG logos with custom typography and shape logic.</p>
                    </div>

                    <div className="flex-grow flex items-center justify-center relative">
                        <h1 className="text-[8rem] md:text-[10rem] font-heading font-black leading-none bg-gradient-to-br from-white via-gray-400 to-gray-600 bg-clip-text text-transparent opacity-90 group-hover:scale-110 transition-transform duration-500 ease-elastic">
                            Aa
                        </h1>
                    </div>
                </motion.div>

                {/* 2. Converter (1x1) */}
                <motion.div
                    variants={item}
                    onClick={() => navigate('/converter')}
                    className="glass-card p-8 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                >
                    <div>
                        <div className="p-3 bg-emerald-500/10 w-fit rounded-2xl mb-4">
                            <Layers className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Batch Converter</h3>
                        <p className="text-sm text-text-muted">Process thousands of images locally.</p>
                    </div>
                    <div className="flex items-center justify-center mt-4">
                        <code className="bg-black/30 px-3 py-1 rounded text-emerald-400 font-mono text-sm group-hover:scale-110 transition-transform">
                            .png .jpg .webp
                        </code>
                    </div>
                </motion.div>

                {/* 3. Vectorizer (1x1) */}
                <motion.div
                    variants={item}
                    onClick={() => navigate('/vectorizer')}
                    className="glass-card p-8 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                >
                    <div>
                        <div className="p-3 bg-purple-500/10 w-fit rounded-2xl mb-4">
                            <Image className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Vector Pro</h3>
                        <p className="text-sm text-text-muted">Convert bitmaps to simplified SVGs.</p>
                    </div>
                    <div className="flex items-center justify-center mt-4 text-purple-500 group-hover:scale-110 transition-transform duration-500">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                        </svg>
                    </div>
                </motion.div>

                {/* 4. Thumbnail Lab (2x1) */}
                <motion.div
                    variants={item}
                    className="glass-card col-span-1 md:col-span-2 lg:col-span-2 p-8 cursor-pointer group relative overflow-hidden flex flex-col justify-center"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="max-w-xs">
                            <div className="p-3 bg-blue-500/10 w-fit rounded-2xl mb-4">
                                <Wand2 className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Thumbnail Lab</h3>
                            <p className="text-text-muted">Generate social assets with smart templates.</p>
                        </div>
                        <div className="flex gap-3 group-hover:scale-105 transition-transform duration-300">
                            <div className="w-24 h-14 bg-zinc-800 rounded-lg shadow-lg"></div>
                            <div className="w-24 h-14 bg-accent rounded-lg shadow-lg"></div>
                        </div>
                    </div>
                    <button className="absolute bottom-6 right-6 w-10 h-10 bg-bg rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                        <Wand2 className="w-4 h-4 text-white" />
                    </button>
                </motion.div>

                {/* 5. Image Editor (2x1) */}
                <motion.div
                    variants={item}
                    onClick={() => navigate('/editor')}
                    className="glass-card col-span-1 md:col-span-2 lg:col-span-2 p-8 cursor-pointer group relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 h-full">
                        <div className="max-w-xs relative z-10">
                            <div className="p-3 bg-orange-500/10 w-fit rounded-2xl mb-4">
                                <Scissors className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Image Editor</h3>
                            <p className="text-text-muted">Quick adjustments, crops, and filters.</p>
                        </div>
                        <div className="text-orange-500/50 group-hover:text-orange-500/80 transition-colors duration-500">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
