import { useNavigate } from 'react-router-dom';
import { PenTool, Image, Layers, Scissors, ArrowRight, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

const tools = [
    {
        id: 'logo',
        title: 'Logo Studio',
        desc: 'Professional SVG logo creation with shape logic.',
        icon: PenTool,
        path: '/logo-studio',
        color: 'from-blue-500 to-cyan-400',
        span: '',
    },
    {
        id: 'vector',
        title: 'Vector Pro',
        desc: 'Convert bitmaps to simplified SVGs.',
        icon: Image,
        path: '/vectorizer',
        color: 'from-purple-500 to-pink-500',
        span: '',
    },
    {
        id: 'converter',
        title: 'Batch Converter',
        desc: 'Process thousands of images locally.',
        icon: Layers,
        path: '/converter',
        color: 'from-emerald-500 to-teal-400',
        span: '',
    },
    {
        id: 'editor',
        title: 'Image Editor',
        desc: 'Quick adjustments and filters.',
        icon: Scissors,
        path: '/editor',
        color: 'from-orange-500 to-red-400',
        span: '',
    }
];

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

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="space-y-16">
            <header className="space-y-6 text-center pt-10 pb-6">
                <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight">
                    Create <span className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Anything</span>.
                </h1>
                <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                    Your browser-based studio for rapid asset generation. <br className="hidden md:block" /> No uploads, no limits.
                </p>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
                {tools.map((tool) => {
                    const Icon = tool.icon;

                    return (
                        <motion.div
                            key={tool.id}
                            variants={item}
                            onClick={() => navigate(tool.path)}
                            className={`group relative overflow-hidden bg-surface-card border border-border rounded-[32px] p-8 cursor-pointer hover:border-border-hover hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 min-h-[220px] flex flex-col justify-between ${tool.span}`}
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${tool.color} transition-opacity duration-500`} />

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-gradient-to-br ${tool.color}`}>
                                    <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">{tool.title}</h3>
                                <p className="text-base text-text-muted group-hover:text-gray-300 leading-relaxed">{tool.desc}</p>
                            </div>
                        </motion.div>
                    )
                })}

                <motion.div variants={item} className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
                    <div className="relative z-10 max-w-lg text-center md:text-left">
                        <h3 className="text-3xl font-bold text-white mb-3">Need a Thumbnail?</h3>
                        <p className="text-blue-100 mb-8 text-lg">Use our smart templates to generate click-worthy thumbnails in seconds.</p>
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Open Lab
                        </button>
                    </div>
                    <Wand2 className="w-64 h-64 text-white/10 absolute -right-12 -bottom-12 group-hover:rotate-12 transition-transform duration-500 pointer-events-none" />
                </motion.div>

            </motion.div>
        </div>
    );
}
