import gifshot from "gifshot";

export interface GenerateGifOptions {
  images: string[]; // 4 data URLs
  width?: number; // default 400
  height?: number; // default 300
  interval?: number; // default 0.45s per frame
  progressCallback?: (progress: number) => void;
}

export function generateAnimatedGif(options: GenerateGifOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const { images, width = 480, height = 360, interval = 0.45, progressCallback } = options;

    if (!images || images.length === 0) {
      return reject(new Error("No images provided for GIF creation"));
    }

    try {
      gifshot.createGIF(
        {
          images,
          gifWidth: width,
          gifHeight: height,
          interval,
          numWorkers: 2,
          progressCallback: (progress) => {
            if (progressCallback) {
              progressCallback(Math.round(progress * 100));
            }
          },
        },
        (result) => {
          if (result.error) {
            reject(new Error(result.errorMsg || "Failed to generate GIF"));
          } else {
            resolve(result.image);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
