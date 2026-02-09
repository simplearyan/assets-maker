import { useRef } from 'react';
import { cn } from '../../../lib/utils';
import { Input } from './Input';

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={cn("flex gap-2 items-center", className)}>
            <div className="relative group">
                <div
                    className="w-10 h-10 rounded-lg border border-white/10 shadow-sm overflow-hidden cursor-pointer transition-transform active:scale-95 group-hover:border-white/20"
                    style={{ backgroundColor: value }}
                    onClick={() => inputRef.current?.click()}
                />
                <input
                    ref={inputRef}
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
            </div>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="font-mono uppercase"
                maxLength={7}
            />
        </div>
    );
}
