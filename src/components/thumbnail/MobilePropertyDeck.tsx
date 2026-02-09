import { cn } from '../../lib/utils';

interface MobilePropertyDeckProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function MobilePropertyDeck({ isOpen, onClose, children }: MobilePropertyDeckProps) {
    return (
        <div
            className={cn(
                "fixed bottom-16 left-0 right-0 z-40 flex flex-col rounded-t-[20px] bg-surface backdrop-blur-2xl border-t border-border shadow-2xl transition-all duration-300 ease-out transform",
                isOpen ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0 pointer-events-none"
            )}
            style={{ maxHeight: '50vh' }}
        >
            <div className="p-4 overflow-y-auto pb-safe">
                {children}
            </div>
        </div>
    );
}
