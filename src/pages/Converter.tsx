import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Upload, RefreshCcw, FileImage, X, CheckCircle2 } from 'lucide-react';

export function Converter() {
    const [files, setFiles] = useState<File[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const startConversion = () => {
        if (files.length === 0) return;
        setIsConverting(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsConverting(false);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-4">
                    Batch Converter
                </h1>
                <p className="text-text-muted">Convert multiple images to different formats effortlessly.</p>
            </div>

            <GlassCard className="min-h-[200px] flex flex-col items-center justify-center border-dashed border-2 border-black/10 dark:border-white/20">
                <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Upload size={24} className="text-green-500 dark:text-green-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">Drop files here</p>
                    <p className="text-text-muted text-sm mb-6">Support JPG, PNG, WEBP</p>
                    <Button onClick={() => document.getElementById('batch-upload')?.click()}>
                        Browse Files
                    </Button>
                    <input
                        id="batch-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </div>
            </GlassCard>

            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Queue ({files.length})</h3>
                        <Button
                            onClick={startConversion}
                            className="bg-green-500 text-white hover:bg-green-400"
                            disabled={isConverting}
                        >
                            {isConverting ? `Processing ${progress}%` : <><RefreshCcw size={18} /> Convert All</>}
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {files.map((file, i) => (
                            <GlassCard key={i} className="flex items-center justify-between p-4 !rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                        <FileImage size={20} className="text-text-muted" />
                                    </div>
                                    <div>
                                        <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>

                                {isConverting ? (
                                    <div className="w-32 h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-300"
                                            style={{ width: `${Math.min(100, Math.max(0, progress + (Math.random() * 20 - 10)))}%` }} // decorative random jitter
                                        />
                                    </div>
                                ) : progress === 100 ? (
                                    <span className="text-green-500 dark:text-green-400 flex items-center gap-1 text-sm font-medium">
                                        <CheckCircle2 size={16} /> Done
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => removeFile(i)}
                                        className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-text-muted hover:text-red-400 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </GlassCard>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
