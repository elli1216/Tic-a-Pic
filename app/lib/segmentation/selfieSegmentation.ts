// Client-side AI Background Segmentation Engine using MediaPipe WebAssembly
// Loads model dynamically to keep initial bundle ultra fast and lightweight

export interface SegmentationResults {
  segmentationMask: ImageBitmap | HTMLCanvasElement | HTMLVideoElement;
  image: HTMLVideoElement | HTMLCanvasElement;
}

export type SegmentationCallback = (results: {
  segmentationMask: CanvasImageSource;
  image: CanvasImageSource;
}) => void;

class SelfieSegmentationEngine {
  private isLoaded = false;
  private isLoading = false;
  private segmenter: unknown = null;
  private loadPromise: Promise<boolean> | null = null;

  async load(): Promise<boolean> {
    if (this.isLoaded) return true;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise(async (resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      try {
        this.isLoading = true;

        // Check if script is already present
        if (!window.SelfieSegmentation) {
          await this.loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js"
          );
        }

        if (window.SelfieSegmentation) {
          const segmenter = new window.SelfieSegmentation({
            locateFile: (file: string) =>
              `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
          });

          segmenter.setOptions({
            modelSelection: 1, // 1 = landscape high accuracy, 0 = general fast
            selfieMode: false,
          });

          await segmenter.initialize();
          this.segmenter = segmenter;
          this.isLoaded = true;
          this.isLoading = false;
          resolve(true);
        } else {
          console.warn("SelfieSegmentation script failed to expose window.SelfieSegmentation");
          this.isLoading = false;
          resolve(false);
        }
      } catch (err) {
        console.warn("Could not load MediaPipe Selfie Segmentation model:", err);
        this.isLoading = false;
        resolve(false);
      }
    });

    return this.loadPromise;
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  onResults(callback: SegmentationCallback) {
    if (this.segmenter && typeof (this.segmenter as { onResults: unknown }).onResults === "function") {
      (this.segmenter as { onResults: (cb: unknown) => void }).onResults(callback);
    }
  }

  async send(input: { image: HTMLVideoElement | HTMLCanvasElement }): Promise<void> {
    if (this.segmenter && this.isLoaded) {
      await (this.segmenter as { send: (input: { image: HTMLVideoElement | HTMLCanvasElement }) => Promise<void> }).send(input);
    }
  }

  getIsLoaded() {
    return this.isLoaded;
  }
}

// Global declaration for MediaPipe window object
declare global {
  interface Window {
    SelfieSegmentation?: new (config: {
      locateFile: (file: string) => string;
    }) => {
      setOptions: (options: { modelSelection?: number; selfieMode?: boolean }) => void;
      initialize: () => Promise<void>;
      onResults: (callback: unknown) => void;
      send: (input: { image: HTMLVideoElement | HTMLCanvasElement }) => Promise<void>;
    };
  }
}

export const selfieSegmentation = new SelfieSegmentationEngine();
