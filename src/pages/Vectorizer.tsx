import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Upload, ArrowRight, Download, Wand2, Image as ImageIcon, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageTracer from 'imagetracerjs';
import { useNavigate } from 'react-router-dom';

export function Vectorizer() {
    const [image, setImage] = useState<string | null>(null);
    const [svgResult, setSvgResult] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const navigate = useNavigate();

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            setSvgResult(null);
            setIsDone(false);
        }
    };

    const handleConvert = () => {
        if (!image) return;
        setIsProcessing(true);

        // Detailed configuration for high quality output
        const options = {
            ltres: 1,
            qtres: 1,
            pathomit: 8,
            colorsampling: 2, // 0=disabled, 1=random, 2=deterministic
            numberofcolors: 16,
            mincolorratio: 0.02,
            colorquantcycles: 3,
            scale: 1,
            simplify: 0,
            roundcoords: 1,
            lcpr: 0,
            qcpr: 0,
            desc: false,
            viewbox: true,
            blurradius: 0,
            blurdelta: 20
        };

        // Defer processing to allow UI update
        setTimeout(() => {
            ImageTracer.imageToSVG(image, (svgstr) => {
                setSvgResult(svgstr);
                setIsProcessing(false);
                setIsDone(true);
            }, options);
        }, 100);
    };

    const downloadSVG = () => {
        if (!svgResult) return;
        const blob = new Blob([svgResult], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'vectorized-image.svg';
        link.href = url;
        link.click();
    };

    const editInStudio = () => {
        if (!svgResult) return;
        navigate('/logo-studio', { state: { importedSVG: svgResult } });
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Vector Pro
                </h1>
                <p className="text-text-muted text-lg max-w-xl mx-auto">
                    Convert your raster images (JPG, PNG) into scalable SVG vectors instantly using our advanced AI engine.
                </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative items-start">
                {/* Input Side */}
                <GlassCard className="min-h-[400px] flex flex-col items-center justify-center border-dashed border-2 border-white/20 relative overflow-hidden group">
                    {image ? (
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <img src={image} alt="Original" className="max-w-full max-h-[350px] object-contain rounded-lg shadow-2xl" />
                            <button
                                onClick={() => setImage(null)}
                                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            >
                                <Upload size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center p-8">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Upload size={32} className="text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
                            <p className="text-text-muted mb-6">Drag & drop or click to browse</p>
                            <Button onClick={() => document.getElementById('file-upload')?.click()}>
                                Select File
                            </Button>
                        </div>
                    )}
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </GlassCard>

                {/* Process Button (Mobile: Center, Desktop: Absolute Center) */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <Button
                        size="lg"
                        className="rounded-full w-16 h-16 !p-0 flex items-center justify-center shadow-xl shadow-purple-500/20"
                        disabled={!image || isProcessing}
                        onClick={handleConvert}
                    >
                        {isProcessing ? (
                            <Wand2 className="animate-spin" />
                        ) : (
                            <ArrowRight size={24} />
                        )}
                    </Button>
                </div>

                {/* Output Side */}
                <GlassCard className="min-h-[400px] flex flex-col items-center justify-center border-dashed border-2 border-black/10 dark:border-white/20 relative overflow-hidden bg-purple-500/5">
                    <AnimatePresence mode="wait">
                        {!image ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center text-text-muted"
                            >
                                <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Output Preview</p>
                            </motion.div>
                        ) : isProcessing ? (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-purple-600 dark:text-purple-300 animate-pulse">Vectorizing...</p>
                            </motion.div>
                        ) : isDone && svgResult ? (
                            <motion.div
                                key="done"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full h-full flex flex-col items-center text-center"
                            >
                                <div className="flex-1 w-full flex items-center justify-center p-4 bg-[url('/grid-pattern.svg')] bg-repeat opacity-100">
                                    <div
                                        className="max-w-full max-h-[300px] object-contain shadow-2xl bg-transparent"
                                        dangerouslySetInnerHTML={{ __html: svgResult }}
                                    />
                                </div>
                                <div className="w-full p-4 bg-surface backdrop-blur-md rounded-b-3xl border-t border-black/5 dark:border-white/10 flex gap-4 justify-center flex-wrap">
                                    <Button variant="primary" className="bg-purple-500 text-white hover:bg-purple-400" onClick={downloadSVG}>
                                        <Download size={18} className="mr-2" /> SVG
                                    </Button>
                                    <Button variant="glass" onClick={editInStudio}>
                                        <Edit size={18} className="mr-2" /> Edit in Studio
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center text-text-muted opacity-50">
                                <p>Ready to convert</p>
                                <Button variant="ghost" className="mt-4" onClick={handleConvert}>Start Conversion</Button>
                            </div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </div>
        </div>
    );
}
