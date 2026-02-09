import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
    isNavVisible: boolean;
    setNavVisible: (visible: boolean) => void;
    toggleNavVisible: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            isNavVisible: true,
            setNavVisible: (visible) => set({ isNavVisible: visible }),
            toggleNavVisible: () => set((state) => ({ isNavVisible: !state.isNavVisible })),
        }),
        {
            name: 'kenichi-ui-storage',
        }
    )
);
