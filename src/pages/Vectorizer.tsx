import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Upload, ArrowRight, Download, Wand2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Vectorizer() {
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            setIsDone(false);
        }
    };

    const handleConvert = () => {
        if (!image) return;
        setIsProcessing(true);
        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsDone(true);
        }, 2000);
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
                        <img src={image} alt="Original" className="max-w-full max-h-[350px] object-contain rounded-lg shadow-2xl" />
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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-text-muted"
                            >
                                <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Output Preview</p>
                            </motion.div>
                        ) : isProcessing ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-purple-600 dark:text-purple-300 animate-pulse">Vectorizing...</p>
                            </motion.div>
                        ) : isDone ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full h-full flex flex-col items-center text-center"
                            >
                                <div className="flex-1 w-full flex items-center justify-center p-4">
                                    {/* Mock Result - In reality this would be the SVG */}
                                    <img src={image} alt="Vector Result" className="max-w-full max-h-[300px] object-contain rounded-lg shadow-2xl saturate-150 contrast-125" />
                                </div>
                                <div className="w-full p-4 bg-surface backdrop-blur-md rounded-b-3xl border-t border-black/5 dark:border-white/10 flex gap-4 justify-center">
                                    <Button variant="primary" className="bg-purple-500 text-white hover:bg-purple-400">
                                        <Download size={18} /> SVG
                                    </Button>
                                    <Button variant="glass">
                                        <Download size={18} /> PNG
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center text-text-muted opacity-50">
                                <p>Ready to convert</p>
                            </div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </div>
        </div>
    );
}
