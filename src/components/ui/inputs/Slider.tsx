import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../lib/utils';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valueDisplay?: string | number;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, valueDisplay, ...props }, ref) => {
        return (
            <div className="relative flex items-center w-full">
                <input
                    type="range"
                    className={cn(
                        "w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent/50",
                        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
                        "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);

Slider.displayName = "Slider";
