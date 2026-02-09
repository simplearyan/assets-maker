import { type HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, hoverEffect = true, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'glass-panel rounded-3xl p-6 transition-all duration-300 border border-black/5 dark:border-white/10',
                    hoverEffect && 'hover:border-black/10 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl',
                    className
                )}
                {...props}
            />
        );
    }
);

GlassCard.displayName = 'GlassCard';
