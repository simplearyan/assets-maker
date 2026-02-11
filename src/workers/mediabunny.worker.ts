import {
    Output,
    BufferTarget,
    Mp4OutputFormat,
    MovOutputFormat,
    WebMOutputFormat,
    VideoSampleSource,
    VideoSample
} from 'mediabunny';

console.log("[MediaBunny Worker] Script Loaded and Initializing...");

let output: Output | null = null;
let target: BufferTarget | null = null;
let source: VideoSampleSource | null = null;

let pendingFrames = 0;

// Throttle progress updates to avoid flooding main thread
let lastProgressUpdate = 0;
const sendProgress = (force = false) => {
    const now = Date.now();
    // Update at most every 50ms or if forced
    if (force || now - lastProgressUpdate > 50) {
        self.postMessage({
            type: 'PROGRESS',
            data: {
                queueSize: pendingFrames
            }
        });
        lastProgressUpdate = now;
    }
};

// Task Queue for sequential processing
const taskQueue: any[] = [];
let isProcessing = false;

const processQueue = async () => {
    if (isProcessing || taskQueue.length === 0) return;
    isProcessing = true;

    try {
        while (taskQueue.length > 0) {
            const data = taskQueue.shift();

            // Actual Encoding Logic
            const { bitmap, timestamp, duration } = data;

            try {
                if (!source) throw new Error("Source not initialized");

                const frame = new VideoFrame(bitmap, {
                    timestamp: Math.round(timestamp),
                    duration: duration ? Math.round(duration) : undefined
                });

                const sample = new VideoSample(frame);
                try {
                    await source.add(sample);
                } catch (e: any) {
                    console.error("Frame Encode Error:", e);
                    self.postMessage({ type: 'LOG', message: `Frame Encode Error: ${e.message} @ ${timestamp}` });
                    throw e;
                } finally {
                    sample.close();
                    frame.close();
                    bitmap.close();
                }

                // Signal Completion for Semaphore
                self.postMessage({ type: 'FRAME_DONE' });

            } catch (err: any) {
                self.postMessage({ type: 'ERROR', error: err.message });
                taskQueue.length = 0;
            }

            // Stats
            pendingFrames--;
            sendProgress(true);
        }
    } finally {
        isProcessing = false;
    }
};

self.onmessage = async (e) => {
    const { type, data } = e.data;

    try {
        if (type === 'CONFIG') {
            const config = data;
            console.log(`[MediaBunny Worker] RECEIVED CONFIG:`, config);
            self.postMessage({ type: 'LOG', message: "Configuring MediaBunny pipeline..." });

            target = new BufferTarget();

            let format;
            if (config.format === 'mov') format = new MovOutputFormat();
            else if (config.format === 'webm') format = new WebMOutputFormat();
            else format = new Mp4OutputFormat();

            output = new Output({
                target: target as any,
                format
            });

            // Select codec based on format
            // @ts-ignore
            const codec = config.format === 'webm' ? 'vp9' : 'avc';

            // @ts-ignore
            source = new VideoSampleSource({
                width: config.width,
                height: config.height,
                frameRate: config.fps,
                codec: codec,
                bitrate: config.bitrate || 6_000_000
            } as any);

            await output.addVideoTrack(source);
            await output.start();

            self.postMessage({ type: 'READY' });
        }
        else if (type === 'ENCODE_FRAME') {
            pendingFrames++;
            sendProgress();

            taskQueue.push(data);
            processQueue();
        }
        else if (type === 'FINALIZE') {
            const drainQueue = async () => {
                while (taskQueue.length > 0 || isProcessing) {
                    await new Promise(r => setTimeout(r, 50));
                }
            };
            await drainQueue();

            try {
                self.postMessage({ type: 'LOG', message: "Finalizing: Closing video source..." });
                if (source) {
                    // @ts-ignore
                    if (source.close) {
                        await source.close();
                    }
                }

                self.postMessage({ type: 'LOG', message: "Finalizing: Writing file container..." });
                if (output) {
                    await output.finalize();
                }

                // Wait for buffer
                let attempts = 0;
                self.postMessage({ type: 'LOG', message: "Finalizing: Polling for target buffer..." });

                while (!target?.buffer && attempts < 100) {
                    await new Promise(r => setTimeout(r, 100));
                    attempts++;
                }

                if (target && target.buffer) {
                    self.postMessage({ type: 'LOG', message: `Export complete! File size: ${target.buffer.byteLength} bytes.` });
                    (self as any).postMessage({ type: 'COMPLETE', data: target.buffer }, [target.buffer]);
                } else {
                    throw new Error("Export failed: Buffer empty after finalize.");
                }
            } catch (err: any) {
                self.postMessage({ type: 'ERROR', error: `Finalize Error: ${err.message}` });
            }
        }
    } catch (err: any) {
        console.error(err);
        self.postMessage({ type: 'ERROR', error: err.message });
    }
};
