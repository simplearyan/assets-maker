import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { AlertTriangle, Info, XCircle } from 'lucide-react';

interface AlertModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function AlertModal({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning'
}: AlertModalProps) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (variant) {
            case 'danger': return <XCircle className="text-red-500" size={32} />;
            case 'info': return <Info className="text-blue-500" size={32} />;
            default: return <AlertTriangle className="text-amber-500" size={32} />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative w-full max-w-md"
                    >
                        <GlassCard
                            className="p-6 space-y-4"
                            hoverEffect={false}
                            style={{
                                borderLeft: `4px solid ${variant === 'danger' ? '#ef4444' :
                                        variant === 'info' ? '#3b82f6' :
                                            '#f59e0b'
                                    }`
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 pt-0.5">
                                    {getIcon()}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-text-main leading-tight">{title}</h3>
                                    <p className="text-sm text-text-muted mt-2 leading-relaxed">{description}</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="ghost" onClick={onCancel} size="sm">
                                    {cancelText}
                                </Button>
                                <Button
                                    variant="primary"
                                    className={variant === 'danger' ? '!bg-red-500 hover:!bg-red-600 border-red-400' : ''}
                                    onClick={onConfirm}
                                    size="sm"
                                >
                                    {confirmText}
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
