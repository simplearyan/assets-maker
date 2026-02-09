import { Drawer } from 'vaul';
import { PropertiesPanel } from './PropertiesPanel';
import type { ThumbnailElement } from '../../types/thumbnail';

interface PropertiesDrawerProps {
    element: ThumbnailElement | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onChange: (id: string, attrs: Partial<ThumbnailElement>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onReorder: (id: string, type: 'front' | 'back' | 'forward' | 'backward') => void;
}

export function PropertiesDrawer({ element, isOpen, onOpenChange, onChange, onDelete, onDuplicate, onReorder }: PropertiesDrawerProps) {
    return (
        <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Drawer.Content className="bg-surface backdrop-blur-3xl flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 outline-none">
                    <div className="p-4 bg-transparent rounded-t-[10px] flex-1 overflow-auto">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-8" />
                        <PropertiesPanel
                            element={element}
                            onChange={onChange}
                            onDelete={(id) => {
                                onDelete(id);
                                onOpenChange(false);
                            }}
                            onDuplicate={(id) => {
                                onDuplicate(id);
                                onOpenChange(false);
                            }}
                            onReorder={onReorder}
                            onClose={() => onOpenChange(false)}
                        />
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
