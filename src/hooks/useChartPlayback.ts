import { useState, useEffect, useCallback, useRef } from 'react';

interface PlaybackState {
    currentTime: number; // in ms
    duration: number; // in ms
    isPlaying: boolean;
    playbackRate: number;
}

export function useChartPlayback(initialDuration: number = 5000) {
    const [state, setState] = useState<PlaybackState>({
        currentTime: 0,
        duration: initialDuration,
        isPlaying: false,
        playbackRate: 1,
    });

    const lastFrameTime = useRef<number>(0);
    const rafId = useRef<number>(0);

    const play = useCallback(() => {
        if (state.isPlaying) return;

        setState(prev => {
            let nextTime = prev.currentTime;
            if (nextTime >= prev.duration) nextTime = 0;
            return { ...prev, isPlaying: true, currentTime: nextTime };
        });

        lastFrameTime.current = performance.now();
    }, [state.isPlaying]);

    const pause = useCallback(() => {
        setState(prev => ({ ...prev, isPlaying: false }));
        if (rafId.current) cancelAnimationFrame(rafId.current);
    }, []);

    const seek = useCallback((time: number) => {
        setState(prev => ({
            ...prev,
            currentTime: Math.max(0, Math.min(time, prev.duration))
        }));
    }, []);

    const setDuration = useCallback((duration: number) => {
        setState(prev => ({ ...prev, duration: Math.max(100, duration) }));
    }, []);

    const loop = useCallback((now: number) => {
        if (!state.isPlaying) return;

        const dt = now - lastFrameTime.current;
        lastFrameTime.current = now;

        setState(prev => {
            let nextTime = prev.currentTime + (dt * prev.playbackRate);

            if (nextTime >= prev.duration) {
                nextTime = prev.duration;
                // Auto-pause at end for now, or we could loop
                return { ...prev, currentTime: nextTime, isPlaying: false };
            }

            return { ...prev, currentTime: nextTime };
        });

        rafId.current = requestAnimationFrame(loop);
    }, [state.isPlaying]);

    useEffect(() => {
        if (state.isPlaying) {
            rafId.current = requestAnimationFrame(loop);
        } else {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        }
        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [state.isPlaying, loop]);

    return {
        ...state,
        play,
        pause,
        seek,
        setDuration,
    };
}
