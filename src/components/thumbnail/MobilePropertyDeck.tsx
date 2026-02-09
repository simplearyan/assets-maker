import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useEffect, useState } from 'react';

interface MobilePropertyDeckProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function MobilePropertyDeck({ isOpen, onClose, title, children }: MobilePropertyDeckProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            // Delay unmounting or hiding if we were doing complex mounting logic, 
            // but here we just toggle classes.
            // We can use a timeout to remove from DOM if we wanted, but CSS toggle is fine for performance here.
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

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
