import { cn } from '../../lib/utils';


interface BentoCardProps {
    title: string;
    description: string;
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    visual?: React.ReactNode;
}

export function BentoCard({
    title,
    description,
    className,
    children,
    onClick,
    visual
}: BentoCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden",
                "bg-surface-card border border-border rounded-[32px] p-10",
                "flex flex-col justify-between transition-all duration-400 ease-out",
                "hover:border-border-hover hover:-translate-y-1 hover:shadow-2xl",
                "cursor-pointer",
                className
            )}
        >
            <div className="flex flex-col gap-2 z-10">
                <h3 className="text-2xl font-bold font-heading text-card-foreground dark:text-white text-gray-900">{title}</h3>
                <p className="text-text-muted text-base font-medium">{description}</p>
            </div>

            <div className="flex-grow flex items-center justify-center py-6 relative z-0">
                <div className="transform transition-transform duration-500 ease-elastic group-hover:scale-110">
                    {visual || children}
                </div>
            </div>

            <div className="absolute bottom-8 right-8 w-10 h-10 bg-bg rounded-full flex items-center justify-center opacity-0 scale-50 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-900 dark:text-white"
                >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
}
