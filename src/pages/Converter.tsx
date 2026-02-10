import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Upload, RefreshCcw, FileImage, X, CheckCircle2, Download, Archive, Settings2 } from 'lucide-react';
import JSZip from 'jszip';
import { Slider } from '../components/ui/inputs/Slider';
import { Label } from '../components/ui/inputs/Label';
import { AnimatePresence, motion } from 'framer-motion';

type Format = 'image/png' | 'image/jpeg' | 'image/webp';

interface ConvertedFile {
    originalName: string;
    newName: string;
    blob: Blob;
    url: string;
}

export function Converter() {
    const [files, setFiles] = useState<File[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
    const [view, setView] = useState<'upload' | 'results'>('upload');

    // Settings
    const [targetFormat, setTargetFormat] = useState<Format>('image/png');
    const [quality, setQuality] = useState(0.9);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
            setConvertedFiles([]); // Reset previous results if adding new files
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const convertFile = (file: File): Promise<ConvertedFile> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context not supported'));
                    return;
                }

                // Draw image to canvas
                // For JPEG, fill transparent background with white
                if (targetFormat === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const ext = targetFormat.split('/')[1];
                        const newName = file.name.replace(/\.[^/.]+$/, "") + '.' + ext;
                        resolve({
                            originalName: file.name,
                            newName,
                            blob,
                            url: URL.createObjectURL(blob)
                        });
                    } else {
                        reject(new Error('Conversion failed'));
                    }
                    URL.revokeObjectURL(url); // Clean up original object URL
                }, targetFormat, quality);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = url;
        });
    };

    const startConversion = async () => {
        if (files.length === 0) return;
        setIsConverting(true);
        setView('results');
        setProgress(0);
        setConvertedFiles([]);

        const results: ConvertedFile[] = [];
        const total = files.length;

        for (let i = 0; i < total; i++) {
            try {
                const result = await convertFile(files[i]);
                results.push(result);
                setConvertedFiles(prev => [...prev, result]);
            } catch (error) {
                console.error(`Error converting ${files[i].name}:`, error);
            }
            setProgress(Math.round(((i + 1) / total) * 100));
        }

        setIsConverting(false);
    };

    const downloadZip = async () => {
        if (convertedFiles.length === 0) return;

        const zip = new JSZip();
        convertedFiles.forEach(file => {
            zip.file(file.newName, file.blob);
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.download = 'converted_images.zip';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    const downloadSingle = (file: ConvertedFile) => {
        const link = document.createElement('a');
        link.download = file.newName;
        link.href = file.url;
        link.click();
    };

    const formatName = (format: Format) => {
        switch (format) {
            case 'image/png': return 'PNG';
            case 'image/jpeg': return 'JPG';
            case 'image/webp': return 'WEBP';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-4">
                    Batch Converter
                </h1>
                <p className="text-text-muted">Convert multiple images to different formats effortlessly.</p>
            </div>

            {/* Settings Bar */}
            <GlassCard className="p-6 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                        <Settings2 size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold">Conversion Settings</h3>
                        <p className="text-sm text-text-muted">Configure your output format</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex flex-col gap-2">
                        <Label>Target Format</Label>
                        <div className="flex bg-black/10 dark:bg-white/5 rounded-lg p-1">
                            {(['image/png', 'image/jpeg', 'image/webp'] as Format[]).map(format => (
                                <button
                                    key={format}
                                    onClick={() => setTargetFormat(format)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${targetFormat === format
                                        ? 'bg-surface shadow-sm text-green-400'
                                        : 'text-text-muted hover:text-text-main hover:bg-white/5'
                                        }`}
                                >
                                    {formatName(format)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(targetFormat === 'image/jpeg' || targetFormat === 'image/webp') && (
                        <div className="flex flex-col gap-2 min-w-[150px]">
                            <div className="flex justify-between">
                                <Label>Quality</Label>
                                <span className="text-xs text-text-muted">{Math.round(quality * 100)}%</span>
                            </div>
                            <Slider
                                min={0.1}
                                max={1.0}
                                step={0.05}
                                value={quality}
                                onChange={(e) => setQuality(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Upload Area */}
                <div className="md:col-span-1 space-y-4">
                    <GlassCard className="h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-green-500/20 relative overflow-hidden group cursor-pointer hover:border-green-500/40 transition-colors"
                        onClick={() => document.getElementById('batch-upload')?.click()}
                    >
                        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="text-center p-6 relative z-10">
                            <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Upload size={24} className="text-green-500" />
                            </div>
                            <p className="font-medium mb-1">Click to Upload</p>
                            <p className="text-xs text-text-muted mb-4">JPG, PNG, WEBP</p>
                            <Button size="sm" variant="glass">Select Files</Button>
                        </div>
                        <input
                            id="batch-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                        />
                    </GlassCard>

                    {files.length > 0 && (
                        <Button
                            className="w-full bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/20"
                            size="lg"
                            onClick={startConversion}
                            disabled={isConverting}
                        >
                            {isConverting ? (
                                <RefreshCcw size={18} className="mr-2 animate-spin" />
                            ) : (
                                <RefreshCcw size={18} className="mr-2" />
                            )}
                            {isConverting ? 'Converting...' : `Convert ${files.length} Files`}
                        </Button>
                    )}
                </div>

                {/* File List / Results */}
                <div className="md:col-span-2">
                    <GlassCard className="min-h-[500px] flex flex-col">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-semibold">
                                {view === 'upload' ? 'Input Queue' : 'Conversion Results'}
                            </h3>
                            {view === 'results' && !isConverting && convertedFiles.length > 0 && (
                                <Button size="sm" variant="glass" onClick={downloadZip}>
                                    <Archive size={16} className="mr-2" /> Download All (ZIP)
                                </Button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {isConverting && (
                                <div className="mb-6 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Processing...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {view === 'upload' ? (
                                files.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50 py-20">
                                        <FileImage size={48} className="mb-4" />
                                        <p>No files selected</p>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {files.map((file, i) => (
                                            <motion.div
                                                key={`${file.name}-${i}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg group"
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                                                        <FileImage size={20} className="text-text-muted" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate text-sm">{file.name}</p>
                                                        <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(i)}
                                                    className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )
                            ) : (
                                <div className="space-y-3">
                                    {convertedFiles.map((file, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                                                    <img src={file.url} alt="" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                        <CheckCircle2 size={16} className="text-white drop-shadow-md" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate text-sm text-green-700 dark:text-green-300">{file.newName}</p>
                                                    <p className="text-xs text-green-600/70 dark:text-green-400/70">
                                                        {(file.blob.size / 1024).toFixed(1)} KB
                                                        {file.blob.size < (files.find(f => f.name === file.originalName)?.size || 0) &&
                                                            <span className="ml-1 text-[10px] bg-green-500/20 px-1 rounded">
                                                                -{Math.round((1 - file.blob.size / (files.find(f => f.name === file.originalName)?.size || 1)) * 100)}%
                                                            </span>
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" onClick={() => downloadSingle(file)}>
                                                <Download size={16} />
                                            </Button>
                                        </motion.div>
                                    ))}
                                    {convertedFiles.length === 0 && !isConverting && (
                                        <div className="text-center py-10 text-text-muted">Starting conversion...</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
