import html2canvas from 'html2canvas';

export interface ExportOptions {
    element: HTMLElement;
    duration: number;
    fps: number;
    width: number;
    height: number;
    format: 'webm' | 'mp4' | 'mov';
    onProgress: (progress: number) => void;
    seek: (time: number) => void;
}

export class ExportEngine {
    static async exportVideo({
        element,
        duration,
        fps,
        width: reqWidth,
        height: reqHeight,
        format,
        onProgress,
        seek
    }: ExportOptions): Promise<Blob> {
        // Enforce even dimensions (critical for H.264/WebCodecs)
        const width = reqWidth % 2 === 0 ? reqWidth : reqWidth - 1;
        const height = reqHeight % 2 === 0 ? reqHeight : reqHeight - 1;

        console.log(`[ExportEngine] Starting export: ${width}x${height} @ ${fps}fps, format: ${format}`);

        return new Promise(async (resolve, reject) => {
            try {
                // 1. Initialize Worker (Standard Vite pattern)
                console.log("[ExportEngine] Initializing Worker...");
                const worker = new Worker(
                    new URL('../workers/mediabunny.worker.ts', import.meta.url),
                    { type: 'module' }
                );

                // 2. Worker Listeners (Log Proxying)
                worker.addEventListener('message', (e) => {
                    const { type, message, error } = e.data;
                    if (type === 'LOG') {
                        console.log(`[MediaBunny Worker Log] ${message}`);
                    } else if (type === 'ERROR') {
                        console.error(`[MediaBunny Worker Error] ${error}`);
                        reject(new Error(error));
                    } else if (type === 'PROGRESS') {
                        // queueSize updates if needed
                    }
                });

                worker.addEventListener('error', (e) => {
                    console.error("[ExportEngine] Worker Load Error:", e);
                    reject(new Error("Worker failed to load. Check console for path/PWA issues."));
                });

                // 3. Configure Worker
                console.log("[ExportEngine] Sending CONFIG message to worker...");
                worker.postMessage({
                    type: 'CONFIG',
                    data: {
                        width,
                        height,
                        fps,
                        bitrate: 6_000_000,
                        duration,
                        format
                    }
                });

                // Wait for READY
                await new Promise<void>((res, rej) => {
                    const handler = (e: MessageEvent) => {
                        if (e.data.type === 'READY') {
                            worker.removeEventListener('message', handler);
                            res();
                        } else if (e.data.type === 'ERROR') {
                            worker.removeEventListener('message', handler);
                            rej(new Error(e.data.error));
                        }
                    };
                    worker.addEventListener('message', handler);
                });

                // 4. Semaphore for Backpressure
                const MAX_IN_FLIGHT = 3;
                let credits = MAX_IN_FLIGHT;

                worker.addEventListener('message', (e) => {
                    if (e.data.type === 'FRAME_DONE') {
                        credits++;
                    }
                });

                // 5. Temporary Resizing setup
                // We must force the element to target resolution for html2canvas
                const originalStyle = {
                    width: element.style.width,
                    height: element.style.height,
                    transform: element.style.transform,
                    position: element.style.position,
                    zIndex: element.style.zIndex
                };

                // Resize for capture
                element.style.width = `${width}px`;
                element.style.height = `${height}px`;
                element.style.transform = 'none';
                element.style.position = 'fixed';
                element.style.zIndex = '-9999'; // Hide but keep in DOM for capture

                // 6. Render Loop
                const totalFrames = Math.ceil((duration / 1000) * fps);
                const dt = 1000 / fps;
                const frameDurationUs = 1000000 / fps;

                try {
                    for (let i = 0; i <= totalFrames; i++) {
                        // Backpressure Wait
                        let waitAttempts = 0;
                        while (credits <= 0) {
                            await new Promise(r => setTimeout(r, 10));
                            waitAttempts++;
                            if (waitAttempts > 1000) { // 10s timeout
                                throw new Error("Export stalled: Worker backpressure timeout.");
                            }
                        }
                        credits--;

                        const time = i * dt;
                        seek(time);

                        // Wait for a frame to render (DOM sync + ECharts buffer)
                        await new Promise(r => requestAnimationFrame(r));
                        await new Promise(r => setTimeout(r, 150)); // Increased buffer for stability

                        // Capture Frame
                        const canvas = await html2canvas(element, {
                            width,
                            height,
                            scale: 1,
                            backgroundColor: null,
                            logging: false,
                            useCORS: true
                        });

                        // Snapshot via Bitmap (efficient transfer to worker)
                        const bitmap = await createImageBitmap(canvas);

                        // Transfer to worker
                        worker.postMessage({
                            type: 'ENCODE_FRAME',
                            data: {
                                bitmap,
                                timestamp: i * frameDurationUs,
                                duration: frameDurationUs
                            }
                        }, [bitmap]);

                        if (i % 5 === 0) onProgress((i / totalFrames) * 100);
                    }

                    // 7. Finalize
                    worker.postMessage({ type: 'FINALIZE' });

                    worker.addEventListener('message', (e) => {
                        if (e.data.type === 'COMPLETE') {
                            const blob = new Blob([e.data.data], {
                                type: format === 'mp4' ? 'video/mp4' : (format === 'mov' ? 'video/quicktime' : 'video/webm')
                            });
                            worker.terminate();
                            onProgress(100);
                            resolve(blob);
                        }
                    });

                } finally {
                    // Restore original styles
                    element.style.width = originalStyle.width;
                    element.style.height = originalStyle.height;
                    element.style.transform = originalStyle.transform;
                    element.style.position = originalStyle.position;
                    element.style.zIndex = originalStyle.zIndex;
                }

            } catch (err) {
                console.error("[ExportEngine] Export Error:", err);
                reject(err);
            }
        });
    }
}
