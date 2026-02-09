import { LabelHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> { }

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                "text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 block",
                className
            )}
            {...props}
        />
    )
);

Label.displayName = "Label";
