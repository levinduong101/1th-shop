import { NextResponse } from 'next/server';
import { Jimp } from 'jimp';

const analyzeImage = (pixels: Uint8ClampedArray, width: number, height: number) => {
  let whitePixelCount = 0;
  let blackPixelCount = 0;
  let isGrayscale = true;
  let totalBrightness = 0;
  let opaquePixelCount = 0;
  let contentPixelCount = 0;
  let transparentPixelCount = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const alpha = pixels[i + 3];

    if (alpha < 10) {
      transparentPixelCount++;
    }

    if (Math.abs(r - g) > 2 || Math.abs(r - b) > 2 || Math.abs(g - b) > 2) {
      isGrayscale = false;
    }

    if (alpha >= 250) {
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      opaquePixelCount++;

      if (brightness > 240) whitePixelCount++;
      if (brightness < 20) blackPixelCount++;
      if (brightness >= 20 && brightness <= 240) contentPixelCount++;
    }
  }

  const totalPixels = width * height;
  const whiteRatio = whitePixelCount / totalPixels;
  const blackRatio = blackPixelCount / totalPixels;
  const contentRatio = contentPixelCount / totalPixels;
  const avgBrightness = opaquePixelCount > 0 ? totalBrightness / opaquePixelCount : 128;
  const transparentRatio = transparentPixelCount / totalPixels;

  return {
    isGrayscale,
    hasWhiteBackground: whiteRatio > 0.5,
    hasBlackBackground: blackRatio > 0.3,
    avgBrightness,
    whiteRatio,
    blackRatio,
    contentRatio,
    isMainlyWhite: avgBrightness > 200 && whiteRatio > 0.7,
    isMainlyBlack: avgBrightness < 50 && blackRatio > 0.5,
    hasTransparentBackground: transparentRatio > 0.5,
  };
};

async function processRasterImage(data: ArrayBuffer, colorOption: string): Promise<Buffer | null> {
  try {
    const image = await Jimp.read(Buffer.from(data));
    const { bitmap } = image;
    const { data: pixels, width, height } = bitmap;

    const analysis = analyzeImage(
      new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, pixels.byteLength),
      width,
      height,
    );

    if (!analysis.hasTransparentBackground) {
      const isWhiteOnWhiteImage = analysis.isMainlyWhite && analysis.contentRatio < 0.2;

      if (isWhiteOnWhiteImage) {
        if (colorOption?.toLowerCase() === 'black') {
          image.contrast(0.5);

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const alpha = pixels[i + 3];
            const brightness = (r + g + b) / 3;

            if (alpha === 255 && brightness > 250) {
              pixels[i + 3] = 0;
            } else if (alpha === 255 && brightness > 245) {
              pixels[i + 3] = 50;
            }
          }
        }
      } else if (analysis.hasWhiteBackground) {
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const alpha = pixels[i + 3];
          const brightness = (r + g + b) / 3;

          if (alpha === 255 && brightness > 245) {
            pixels[i + 3] = 0;
          } else if (alpha === 255 && brightness > 230) {
            pixels[i + 3] = 80;
          }
        }
      } else {
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const brightness = (r + g + b) / 3;

          if (brightness > 200) {
            pixels[i + 3] = 0;
          } else if (brightness > 150) {
            pixels[i + 3] = Math.max(0, 255 - brightness);
          }
        }
      }
    }

    if (!analysis.isGrayscale) {
      image.greyscale();
    }

    const hasLightContent =
      analysis.isMainlyBlack || (analysis.hasTransparentBackground && analysis.avgBrightness > 180);
    if (hasLightContent) {
      image.invert();
    }

    image.contrast(0.3);

    if (colorOption?.toLowerCase() === 'white') {
      image.invert();
    }

    return await image.getBuffer('image/png');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing raster image:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const color = formData.get('color') as string;

    if (!file || !color) {
      return NextResponse.json({ error: 'Missing file or color' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const processedBuffer = await processRasterImage(buffer, color);

    if (!processedBuffer) {
      return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }

    return new Response(new Uint8Array(processedBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="processed.png"',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
