//worker
import { Jimp } from 'jimp';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// ✅ Hàm phân tích ảnh thông minh (kết hợp logic từ route.ts)
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

        // Kiểm tra grayscale
        if (Math.abs(r - g) > 2 || Math.abs(r - b) > 2 || Math.abs(g - b) > 2) {
            isGrayscale = false;
        }

        // Chỉ tính pixel không trong suốt
        if (alpha >= 250) {
            const brightness = (r + g + b) / 3;
            totalBrightness += brightness;
            opaquePixelCount++;

            // Đếm pixel trắng (nền nghi ngờ)
            if (brightness > 240) whitePixelCount++;
            // Đếm pixel đen
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
        blackRatio
    };
};

// Process raster image with enhanced logic
const processRasterImage = async (
    data: ArrayBuffer,
    colorOption: string
): Promise<ArrayBuffer | null> => {
    try {
        const image = await Jimp.fromBuffer(data);
        const { bitmap } = image;
        const { data: pixels, width, height } = bitmap;
        
        // ✅ Phân tích ảnh thông minh
        const analysis = analyzeImage(
            new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, pixels.byteLength),
            width,
            height
        );

        console.log('Image analysis:', analysis);

        // ✅ Chỉ xử lý nếu cần thiết
        let needsProcessing = !analysis.isGrayscale || analysis.hasWhiteBackground;

        // ✅ Kiểm tra đặc biệt cho ảnh đã đúng màu mục tiêu
        if (analysis.isGrayscale) {
            const targetIsWhite = colorOption?.toLowerCase() === 'white';
            const imageIsLight = analysis.avgBrightness >= 128;
            
            // Nếu ảnh đã đúng tone màu mong muốn và không có nền trắng cần xóa
            if (targetIsWhite === imageIsLight && !analysis.hasWhiteBackground) {
                needsProcessing = false;
            }
        }

        if (needsProcessing) {
            console.log('Processing image...');

            // ✅ Bước 1: Xóa nền trắng nếu có
            if (analysis.hasWhiteBackground) {
                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const alpha = pixels[i + 3];

                    const brightness = (r + g + b) / 3;

                    // ✅ Chỉ xóa nếu alpha đầy & brightness cao (logic từ route.ts)
                    if (alpha === 255 && brightness > 245) {
                        pixels[i + 3] = 0; // Hoàn toàn trong suốt
                    } else if (alpha === 255 && brightness > 230) {
                        pixels[i + 3] = 80; // Bán trong suốt
                    }
                }
            } else {
                // ✅ Logic cũ cho ảnh không có nền trắng rõ ràng
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

            // ✅ Bước 2: Convert to grayscale nếu chưa
            if (!analysis.isGrayscale) {
                image.greyscale();
            }

            // ✅ Bước 3: Tăng contrast
            image.contrast(0.3);

            // ✅ Bước 4: Đảo màu nếu cần
            if (colorOption?.toLowerCase() === 'white') {
                image.invert();
            }
        } else {
            console.log('Image already in desired format, skipping processing');
        }

        // Return ArrayBuffer
        const buffer = await image.getBuffer("image/png");
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        
        return arrayBuffer instanceof ArrayBuffer
            ? arrayBuffer
            : new ArrayBuffer(arrayBuffer.byteLength);
            
    } catch (error) {
        console.error('Error processing raster image:', error);
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
                    data: { imageBuffer: processedBuffer }
                } as WorkerResponse);
            } else {
                throw new Error('Failed to process image, please try a different image.');
            }
        } catch (error) {
            ctx.postMessage({
                type: 'ERROR',
                data: { error: error instanceof Error ? error.message : 'Unknown error' }
            } as WorkerResponse);
        }
    }
});