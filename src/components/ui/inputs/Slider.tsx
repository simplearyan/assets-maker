import { forwardRef } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../../lib/utils';

interface SliderProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (event: { target: { value: number } }) => void;
    className?: string;
}

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(
    ({ className, min = 0, max = 100, step = 1, value, onChange, ...props }, ref) => {
        const handleValueChange = (values: number[]) => {
            onChange({ target: { value: values[0] } });
        };

        return (
            <SliderPrimitive.Root
                ref={ref}
                className={cn(
                    "relative flex items-center select-none touch-none w-full h-5 cursor-pointer group",
                    className
                )}
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={handleValueChange}
                {...props}
            >
                <SliderPrimitive.Track className="relative bg-zinc-200 dark:bg-white/10 grow rounded-full h-1.5 overflow-hidden group-hover:bg-zinc-300 dark:group-hover:bg-white/20 transition-colors">
                    <SliderPrimitive.Range className="absolute bg-accent h-full" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb
                    className="block w-4 h-4 bg-white border border-black/10 dark:border-transparent rounded-full shadow-lg ring-offset-background transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:scale-110"
                    aria-label="Slider"
                />
            </SliderPrimitive.Root>
        );
    }
);

Slider.displayName = SliderPrimitive.Root.displayName;
