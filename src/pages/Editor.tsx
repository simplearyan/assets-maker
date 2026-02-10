import { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Sliders, Download, RotateCcw, Upload, Crop as CropIcon } from 'lucide-react';

export function Editor() {
    type EditorMode = 'adjust' | 'crop';

    const [mode, setMode] = useState<EditorMode>('adjust');
    const [image, setImage] = useState<string | null>(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [blur, setBlur] = useState(0);
    const [sepia, setSepia] = useState(0);
    const [grayscale, setGrayscale] = useState(0);
    const [crop, setCrop] = useState<Crop>();

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
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) sepia(${sepia}%) grayscale(${grayscale}%)`;
        ctx.drawImage(img, 0, 0, width, height);
    };

    useEffect(() => {
        renderImage();
    }, [brightness, contrast, saturation, blur, sepia, grayscale, image]); // Re-render when values change

    const handleReset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setBlur(0);
        setSepia(0);
        setGrayscale(0);
        setCrop(undefined);
    };

    const applyCrop = () => {
        if (!image || !crop || !imgRef.current) return;

        const canvas = document.createElement('canvas');
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

        canvas.width = crop.width;
        canvas.height = crop.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
            imgRef.current,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const croppedUrl = canvas.toDataURL('image/png');
        setImage(croppedUrl);
        setMode('adjust');
        setCrop(undefined);

        // Update imgRef for filters
        const img = new Image();
        img.src = croppedUrl;
        img.onload = () => {
            imgRef.current = img;
            renderImage();
        };
    };

    const handleSave = () => {
        if (!image || !imgRef.current) return;

        const canvas = document.createElement('canvas');
        const img = imgRef.current;

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) sepia(${sepia}%) grayscale(${grayscale}%)`;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Trigger download
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Editor Canvas */}
            <div
                className="flex-1 bg-surface/30 rounded-3xl border border-border flex items-center justify-center overflow-hidden relative p-8 transition-colors"
                onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-accent/10', 'border-accent');
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-accent/10', 'border-accent');
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-accent/10', 'border-accent');
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                        const url = URL.createObjectURL(file);
                        setImage(url);
                        const img = new Image();
                        img.src = url;
                        img.onload = () => {
                            imgRef.current = img;
                            renderImage();
                        };
                    }
                }}
            >
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />

                {image ? (
                    <div className="relative max-w-full max-h-full">
                        {mode === 'crop' ? (
                            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                                <img src={image} alt="Crop preview" className="max-h-[600px] object-contain" />
                            </ReactCrop>
                        ) : (
                            <canvas
                                ref={canvasRef}
                                className="max-w-full max-h-full rounded shadow-2xl"
                            />
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <Button onClick={() => document.getElementById('editor-upload')?.click()}>
                            <Upload size={18} className="mr-2" /> Open Image
                        </Button>
                        <p className="mt-4 text-sm text-text-muted">or drag and drop an image here</p>
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
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode(mode === 'adjust' ? 'crop' : 'adjust')}
                            className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${mode === 'crop' ? 'bg-accent text-white' : 'text-text-muted hover:text-text-main'}`}
                        >
                            <CropIcon size={12} /> {mode === 'crop' ? 'Done' : 'Crop'}
                        </button>
                        <button onClick={handleReset} className="text-xs text-text-muted hover:text-text-main flex items-center gap-1">
                            <RotateCcw size={12} /> Reset
                        </button>
                    </div>
                </div>

                {mode === 'crop' ? (
                    <div className="space-y-4">
                        <p className="text-sm text-text-muted">Drag on the image to crop.</p>
                        <Button className="w-full" onClick={applyCrop} disabled={!crop}>
                            Apply Crop
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => setMode('adjust')}>
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <RangeControl label="Brightness" value={brightness} min={0} max={200} onChange={setBrightness} />
                        <RangeControl label="Contrast" value={contrast} min={0} max={200} onChange={setContrast} />
                        <RangeControl label="Saturation" value={saturation} min={0} max={200} onChange={setSaturation} />
                        <RangeControl label="Blur" value={blur} min={0} max={20} unit="px" onChange={setBlur} />
                        <RangeControl label="Sepia" value={sepia} min={0} max={100} onChange={setSepia} />
                        <RangeControl label="Grayscale" value={grayscale} min={0} max={100} onChange={setGrayscale} />
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-black/10 dark:border-white/10">
                    <Button className="w-full" disabled={!image} onClick={handleSave}>
                        <Download size={18} className="mr-2" /> Save Image
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
}

const RangeControl = ({ label, value, min, max, onChange, unit = '%' }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span className="text-text-muted">{label}</span>
            <span className="font-mono">{value}{unit}</span>
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
