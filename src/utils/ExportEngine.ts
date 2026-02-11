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
        width,
        height,
        format,
        onProgress,
        seek
    }: ExportOptions): Promise<Blob> {
        return new Promise(async (resolve, reject) => {
            try {
                // 1. Initialize Worker
                const worker = new Worker(
                    new URL('../workers/mediabunny.worker.ts', import.meta.url),
                    { type: 'module' }
                );

                // 2. Configure Worker
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

                // 3. Semaphore for Backpressure
                const MAX_IN_FLIGHT = 3;
                let credits = MAX_IN_FLIGHT;

                worker.addEventListener('message', (e) => {
                    if (e.data.type === 'FRAME_DONE') {
                        credits++;
                    } else if (e.data.type === 'ERROR') {
                        reject(new Error(e.data.error));
                    }
                });

                // 4. Render Loop
                const totalFrames = Math.ceil((duration / 1000) * fps);
                const dt = 1000 / fps;
                const frameDurationUs = 1000000 / fps;

                for (let i = 0; i <= totalFrames; i++) {
                    // Backpressure Wait
                    while (credits <= 0) {
                        await new Promise(r => setTimeout(r, 10));
                    }
                    credits--;

                    const time = i * dt;
                    seek(time);

                    // Wait for a frame to render (DOM sync)
                    await new Promise(r => requestAnimationFrame(r));
                    await new Promise(r => setTimeout(r, 50));

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

                // 5. Finalize
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

            } catch (err) {
                reject(err);
            }
        });
    }
}
