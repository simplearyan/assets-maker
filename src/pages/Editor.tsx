import { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Sliders, Download, RotateCcw, Upload } from 'lucide-react';

export function Editor() {
    const [image, setImage] = useState<string | null>(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);

            const img = new Image();
            img.src = url;
            img.onload = () => {
                imgRef.current = img;
                renderImage();
            };
        }
    };

    const renderImage = () => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions to match image ratio but max width/height
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(img, 0, 0, width, height);
    };

    useEffect(() => {
        renderImage();
    }, [brightness, contrast, saturation, image]); // Re-render when values change

    const handleReset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Editor Canvas */}
            <div className="flex-1 bg-surface/30 rounded-3xl border border-border flex items-center justify-center overflow-hidden relative p-8">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                {image ? (
                    <canvas
                        ref={canvasRef}
                        className="max-w-full max-h-full rounded shadow-2xl"
                    />
                ) : (
                    <div className="text-center">
                        <Button onClick={() => document.getElementById('editor-upload')?.click()}>
                            <Upload size={18} className="mr-2" /> Open Image
                        </Button>
                    </div>
                )}
                <input
                    id="editor-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>

            {/* Sidebar Controls */}
            <GlassCard className="w-80 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Sliders size={20} /> Adjustments
                    </h3>
                    <button onClick={handleReset} className="text-xs text-text-muted hover:text-text-main flex items-center gap-1">
                        <RotateCcw size={12} /> Reset
                    </button>
                </div>

                <div className="space-y-6">
                    <RangeControl label="Brightness" value={brightness} min={0} max={200} onChange={setBrightness} />
                    <RangeControl label="Contrast" value={contrast} min={0} max={200} onChange={setContrast} />
                    <RangeControl label="Saturation" value={saturation} min={0} max={200} onChange={setSaturation} />
                </div>

                <div className="mt-auto pt-6 border-t border-black/10 dark:border-white/10">
                    <Button className="w-full" disabled={!image}>
                        <Download size={18} /> Save Image
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
}

const RangeControl = ({ label, value, min, max, onChange }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span className="text-text-muted">{label}</span>
            <span className="font-mono">{value}%</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent"
        />
    </div>
);
