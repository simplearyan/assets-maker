import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, Palette, Wand2, RefreshCcw, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    {
        title: 'Logo Studio',
        desc: 'Create professional logos with our intuitive drag-and-drop editor.',
        icon: Palette,
        path: '/logo-studio',
        color: 'text-blue-400'
    },
    {
        title: 'Vector Pro',
        desc: 'Convert raster images to scalable SVG vectors instantly.',
        icon: Wand2,
        path: '/vectorizer',
        color: 'text-purple-400'
    },
    {
        title: 'Batch Converter',
        desc: 'Process thousands of images with custom presets and formats.',
        icon: RefreshCcw,
        path: '/converter',
        color: 'text-green-400'
    },
    {
        title: 'Image Editor',
        desc: 'Advanced editing tools with filters, adjustments, and improved UX.',
        icon: Image,
        path: '/editor',
        color: 'text-pink-400'
    }
];

export function Home() {
    return (
        <div className="flex flex-col gap-20">
            {/* Hero Section */}
            <section className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-4xl mx-auto mt-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="hero-mark absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
                    <div className="hero-mark-secondary absolute -bottom-10 right-1/4 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/5 blur-3xl rounded-full -z-10 animate-pulse" />
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-white/50 bg-clip-text text-transparent">
                        Create Assets <br /> Like a Pro
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-xl text-text-muted max-w-2xl mb-10 leading-relaxed"
                >
                    The all-in-one suite for modern creators. Design logos, vectorize images, and process assets with powerful, AI-enhanced tools.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    <Link to="/logo-studio">
                        <Button size="lg" className="rounded-full">
                            Get Started <ArrowRight size={18} />
                        </Button>
                    </Link>
                    <Button variant="glass" size="lg" className="rounded-full">
                        View Features
                    </Button>
                </motion.div>
            </section>

            {/* Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {features.map((feature, i) => (
                    <Ticket
                        key={i}
                        index={i}
                        {...feature}
                    />
                ))}
            </section>
        </div>
    );
}

function Ticket({ title, desc, icon: Icon, path, color, index }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            <Link to={path}>
                <GlassCard className="h-full group hover:bg-surface-card/80 flex flex-col justify-between min-h-[220px]">
                    <div>
                        <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-4 group-hover:scale-110 transition-transform ${color}`}>
                            <Icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">{title}</h3>
                        <p className="text-text-muted leading-relaxed">{desc}</p>
                    </div>

                    <div className="flex justify-end mt-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </GlassCard>
            </Link>
        </motion.div>
    );
}
