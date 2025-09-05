//worker
import { Jimp } from 'jimp';

const ctx: Worker = self as any;

interface WorkerMessage {
  type: 'PROCESS_IMAGE';
  data: {
    imageBuffer: ArrayBuffer;
    color: string;
    fileType?: string;
  };
}

interface WorkerResponse {
  type: 'IMAGE_PROCESSED' | 'ERROR';
  data: {
    imageBuffer?: ArrayBuffer;
    error?: string;
  };
}

// ✅ Smart image analysis function (combines logic from route.ts)
const analyzeImage = (pixels: Uint8ClampedArray, width: number, height: number) => {
  let whitePixelCount = 0;
  let blackPixelCount = 0;
  let isGrayscale = true;
  let totalBrightness = 0;
  let opaquePixelCount = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const alpha = pixels[i + 3];

    // Check for grayscale
    if (Math.abs(r - g) > 2 || Math.abs(r - b) > 2 || Math.abs(g - b) > 2) {
      isGrayscale = false;
    }

    // Only count non-transparent pixels
    if (alpha >= 250) {
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      opaquePixelCount++;

      // Count white pixels (suspected background)
      if (brightness > 240) whitePixelCount++;
      // Count black pixels
      if (brightness < 20) blackPixelCount++;
    }
  }

  const totalPixels = width * height;
  const whiteRatio = whitePixelCount / totalPixels;
  const blackRatio = blackPixelCount / totalPixels;
  const avgBrightness = opaquePixelCount > 0 ? totalBrightness / opaquePixelCount : 128;

  return {
    isGrayscale,
    hasWhiteBackground: whiteRatio > 0.5,
    hasBlackBackground: blackRatio > 0.3,
    avgBrightness,
    whiteRatio,
    blackRatio,
  };
};

// Process raster image with enhanced logic
const processRasterImage = async (
  data: ArrayBuffer,
  colorOption: string,
): Promise<ArrayBuffer | null> => {
  try {
    const image = await Jimp.fromBuffer(data);
    const { bitmap } = image;
    const { data: pixels, width, height } = bitmap;

    // ✅ Smart image analysis
    const analysis = analyzeImage(
      new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, pixels.byteLength),
      width,
      height,
    );

    // ✅ Only process if necessary
    let needsProcessing = !analysis.isGrayscale || analysis.hasWhiteBackground;

    // ✅ Special check for images already in target color
    if (analysis.isGrayscale) {
      const targetIsWhite = colorOption?.toLowerCase() === 'white';
      const imageIsLight = analysis.avgBrightness >= 128;

      // If the image is already in the desired tone and does not have a white background to remove
      if (targetIsWhite === imageIsLight && !analysis.hasWhiteBackground) {
        needsProcessing = false;
      }
    }

    if (needsProcessing) {
      // ✅ Step 1: Remove white background if present
      if (analysis.hasWhiteBackground) {
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const alpha = pixels[i + 3];

          const brightness = (r + g + b) / 3;

          // ✅ Only remove if alpha is full & brightness is high (logic from route.ts)
          if (alpha === 255 && brightness > 245) {
            pixels[i + 3] = 0; // Fully transparent
          } else if (alpha === 255 && brightness > 230) {
            pixels[i + 3] = 80; // Semi-transparent
          }
        }
      } else {
        // ✅ Old logic for images without a clear white background
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          const brightness = (r + g + b) / 3;

          if (brightness > 200) {
            pixels[i + 3] = 0; // Alpha = 0 (transparent)
          } else if (brightness > 150) {
            pixels[i + 3] = Math.max(0, 255 - brightness);
          }
        }
      }

      // ✅ Step 2: Convert to grayscale if not already
      if (!analysis.isGrayscale) {
        image.greyscale();
      }

      // ✅ Step 3: Increase contrast
      image.contrast(0.3);

      // ✅ Step 4: Invert colors if needed
      if (colorOption?.toLowerCase() === 'white') {
        image.invert();
      }
    }

    // Return ArrayBuffer
    const buffer = await image.getBuffer('image/png');
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );

    return arrayBuffer instanceof ArrayBuffer
      ? arrayBuffer
      : new ArrayBuffer(arrayBuffer.byteLength);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

ctx.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  const { type, data } = e.data;

  if (type === 'PROCESS_IMAGE') {
    try {
      const { imageBuffer, color } = data;

      // Process the image with enhanced logic
      const processedBuffer = await processRasterImage(imageBuffer, color);

      if (processedBuffer) {
        ctx.postMessage({
          type: 'IMAGE_PROCESSED',
          data: { imageBuffer: processedBuffer },
        } as WorkerResponse);
      } else {
        throw new Error('Failed to process image, please try a different image.');
      }
    } catch (error) {
      ctx.postMessage({
        type: 'ERROR',
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
      } as WorkerResponse);
    }
  }
});
