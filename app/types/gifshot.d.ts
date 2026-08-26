declare module "gifshot" {
  export interface GifshotOptions {
    images?: (string | HTMLCanvasElement | HTMLImageElement)[];
    video?: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number; // seconds per frame
    numFrames?: number;
    frameDuration?: number;
    sampleInterval?: number;
    numWorkers?: number;
    fontSize?: string;
    fontColor?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    text?: string;
    progressCallback?: (captureProgress: number) => void;
    completeCallback?: (obj: GifshotResult) => void;
  }

  export interface GifshotResult {
    error: boolean;
    errorCode?: string;
    errorMsg?: string;
    image: string; // base64 data:image/gif;base64,...
  }

  export function createGIF(
    options: GifshotOptions,
    callback: (obj: GifshotResult) => void
  ): void;

  export function isSupported(): boolean;
}
