import type { StripCustomization, StripLayout, StripTheme } from "../types/strip";
import { STRIP_THEMES } from "../types/strip";

export interface RenderStripOptions {
  shots: string[]; // 4 data URLs
  customization: StripCustomization;
  scaleFactor?: number; // default 2 for crisp Retina/print output
}

// Helper: load an image from URL or dataURL into an HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

export async function renderStripToCanvas(
  options: RenderStripOptions
): Promise<HTMLCanvasElement> {
  const { shots, customization, scaleFactor = 2 } = options;
  const theme =
    STRIP_THEMES.find((t) => t.id === customization.themeId) || STRIP_THEMES[0];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not get 2D canvas context");

  const layout: StripLayout = customization.layout || "classic_strip_4x1";

  // Canvas dimensions based on layout
  let width = 600 * scaleFactor;
  let height = 1800 * scaleFactor;

  if (layout === "grid_2x2") {
    width = 1200 * scaleFactor;
    height = 1600 * scaleFactor;
  } else if (layout === "twin_strip") {
    width = 1200 * scaleFactor;
    height = 1800 * scaleFactor;
  }

  canvas.width = width;
  canvas.height = height;

  // 1. Draw Background Frame
  if (theme.background.startsWith("linear-gradient")) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    if (theme.id === "cyber-gradient") {
      grad.addColorStop(0, "#3b0764");
      grad.addColorStop(0.5, "#1e1b4b");
      grad.addColorStop(1, "#030712");
    } else {
      grad.addColorStop(0, "#ff9a9e");
      grad.addColorStop(1, "#fecfef");
    }
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = theme.background;
  }
  ctx.fillRect(0, 0, width, height);

  // Load all 4 shots
  const loadedImages: (HTMLImageElement | null)[] = await Promise.all(
    shots.map((shot) =>
      shot ? loadImage(shot).catch(() => null) : Promise.resolve(null)
    )
  );

  // 2. Draw Photos according to layout
  const padX = 40 * scaleFactor;
  const padTop = 40 * scaleFactor;
  const footerHeight = 160 * scaleFactor;
  const innerRadius = 16 * scaleFactor;

  if (layout === "classic_strip_4x1") {
    const usableHeight = height - padTop - footerHeight;
    const gap = 20 * scaleFactor;
    const photoWidth = width - padX * 2;
    const photoHeight = (usableHeight - gap * 3) / 4;

    for (let i = 0; i < 4; i++) {
      const img = loadedImages[i];
      const y = padTop + i * (photoHeight + gap);

      // Draw photo container with rounded corners
      ctx.save();
      roundRect(ctx, padX, y, photoWidth, photoHeight, innerRadius);
      ctx.clip();

      if (img) {
        drawImageCover(ctx, img, padX, y, photoWidth, photoHeight);
      } else {
        ctx.fillStyle = theme.isDark ? "#27272a" : "#f4f4f5";
        ctx.fillRect(padX, y, photoWidth, photoHeight);
      }
      ctx.restore();

      // Subtle photo border
      ctx.save();
      ctx.strokeStyle = theme.isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
      ctx.lineWidth = 2 * scaleFactor;
      roundRect(ctx, padX, y, photoWidth, photoHeight, innerRadius);
      ctx.stroke();
      ctx.restore();
    }
  } else if (layout === "grid_2x2") {
    const usableHeight = height - padTop - footerHeight;
    const gap = 24 * scaleFactor;
    const photoWidth = (width - padX * 2 - gap) / 2;
    const photoHeight = (usableHeight - gap) / 2;

    const positions = [
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 0, row: 1 },
      { col: 1, row: 1 },
    ];

    for (let i = 0; i < 4; i++) {
      const img = loadedImages[i];
      const { col, row } = positions[i];
      const x = padX + col * (photoWidth + gap);
      const y = padTop + row * (photoHeight + gap);

      ctx.save();
      roundRect(ctx, x, y, photoWidth, photoHeight, innerRadius);
      ctx.clip();

      if (img) {
        drawImageCover(ctx, img, x, y, photoWidth, photoHeight);
      } else {
        ctx.fillStyle = theme.isDark ? "#27272a" : "#f4f4f5";
        ctx.fillRect(x, y, photoWidth, photoHeight);
      }
      ctx.restore();

      // Border
      ctx.save();
      ctx.strokeStyle = theme.isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
      ctx.lineWidth = 2 * scaleFactor;
      roundRect(ctx, x, y, photoWidth, photoHeight, innerRadius);
      ctx.stroke();
      ctx.restore();
    }
  } else if (layout === "twin_strip") {
    // Two identical strips side by side with a divider line in the middle
    const singleWidth = width / 2;
    const padSingleX = 30 * scaleFactor;
    const usableHeight = height - padTop - footerHeight;
    const gap = 18 * scaleFactor;
    const photoWidth = singleWidth - padSingleX * 2;
    const photoHeight = (usableHeight - gap * 3) / 4;

    for (let side = 0; side < 2; side++) {
      const offsetX = side * singleWidth;

      for (let i = 0; i < 4; i++) {
        const img = loadedImages[i];
        const x = offsetX + padSingleX;
        const y = padTop + i * (photoHeight + gap);

        ctx.save();
        roundRect(ctx, x, y, photoWidth, photoHeight, innerRadius);
        ctx.clip();

        if (img) {
          drawImageCover(ctx, img, x, y, photoWidth, photoHeight);
        } else {
          ctx.fillStyle = theme.isDark ? "#27272a" : "#f4f4f5";
          ctx.fillRect(x, y, photoWidth, photoHeight);
        }
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = theme.isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
        ctx.lineWidth = 2 * scaleFactor;
        roundRect(ctx, x, y, photoWidth, photoHeight, innerRadius);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Dotted scissor cutting line in center
    ctx.save();
    ctx.setLineDash([8 * scaleFactor, 8 * scaleFactor]);
    ctx.strokeStyle = theme.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
    ctx.lineWidth = 1.5 * scaleFactor;
    ctx.beginPath();
    ctx.moveTo(singleWidth, 20 * scaleFactor);
    ctx.lineTo(singleWidth, height - 20 * scaleFactor);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Draw Placed Stickers
  if (customization.stickers && customization.stickers.length > 0) {
    for (const sticker of customization.stickers) {
      const posX = (sticker.x / 100) * width;
      const posY = (sticker.y / 100) * height;

      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.scale(sticker.scale * scaleFactor, sticker.scale * scaleFactor);

      if (sticker.type === "emoji") {
        ctx.font = "40px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sticker.content, 0, 0);
      } else if (sticker.type === "badge") {
        ctx.font = "bold 14px sans-serif";
        const textWidth = ctx.measureText(sticker.content).width;
        const bPadX = 14;
        const bPadY = 6;

        ctx.fillStyle = "rgba(0,0,0,0.85)";
        roundRect(
          ctx,
          -textWidth / 2 - bPadX,
          -12 - bPadY,
          textWidth + bPadX * 2,
          24 + bPadY * 2,
          8
        );
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sticker.content, 0, 0);
      }
      ctx.restore();
    }
  }

  // 4. Draw Footer Text & Date Stamp
  const textY = height - (footerHeight / 2) * 0.9;
  const textColor = customization.textColor || theme.textColor;

  ctx.save();
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fontFam =
    customization.fontFamily === "handwritten"
      ? "cursive, sans-serif"
      : customization.fontFamily === "mono"
      ? "monospace"
      : customization.fontFamily === "serif"
      ? "serif"
      : "sans-serif";

  // Main custom caption
  ctx.font = `bold ${22 * scaleFactor}px ${fontFam}`;
  const customCaption = customization.customText || "TIC-A-PIC ♡ 2026";

  if (layout === "twin_strip") {
    ctx.fillText(customCaption, width / 4, textY - 14 * scaleFactor);
    ctx.fillText(customCaption, (width * 3) / 4, textY - 14 * scaleFactor);
  } else {
    ctx.fillText(customCaption, width / 2, textY - 14 * scaleFactor);
  }

  // Date stamp
  if (customization.includeDateStamp) {
    ctx.font = `bold ${13 * scaleFactor}px monospace`;
    ctx.fillStyle = theme.isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    if (layout === "twin_strip") {
      ctx.fillText(dateStr, width / 4, textY + 16 * scaleFactor);
      ctx.fillText(dateStr, (width * 3) / 4, textY + 16 * scaleFactor);
    } else {
      ctx.fillText(dateStr, width / 2, textY + 16 * scaleFactor);
    }
  }

  ctx.restore();

  return canvas;
}

export async function renderStripToDataUrl(
  options: RenderStripOptions
): Promise<string> {
  const canvas = await renderStripToCanvas(options);
  return canvas.toDataURL("image/png", 0.95);
}

// Utility: Draw rounded rectangle path
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Utility: Draw image with object-fit: cover
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  const targetRatio = w / h;
  const imgRatio = imgW / imgH;

  let sW = imgW;
  let sH = imgH;
  let sX = 0;
  let sY = 0;

  if (imgRatio > targetRatio) {
    sW = imgH * targetRatio;
    sX = (imgW - sW) / 2;
  } else {
    sH = imgW / targetRatio;
    sY = (imgH - sH) / 2;
  }

  ctx.drawImage(img, sX, sY, sW, sH, x, y, w, h);
}
