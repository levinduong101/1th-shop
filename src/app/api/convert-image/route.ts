//route.ts
import { NextResponse } from 'next/server';
import { Jimp } from 'jimp';

async function processRasterImage(data: ArrayBuffer, colorOption: string): Promise<Buffer | null> {
    try {
        const image = await Jimp.read(Buffer.from(data));
        const { bitmap } = image;
        const { data: pixels, width, height } = bitmap;

        // ✅ Đếm số pixel nền sáng để ước lượng
        let whitePixelCount = 0;

        // ✅ Bước 1: Chạy qua tất cả pixel
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const alpha = pixels[i + 3];

            const brightness = (r + g + b) / 3;

            // Không động vào pixel đã trong suốt
            if (alpha < 250) continue;

            // Đếm pixel sáng (nghi ngờ là nền)
            if (brightness > 240) whitePixelCount++;
        }

        const totalPixels = width * height;
        const whiteRatio = whitePixelCount / totalPixels;

        // ✅ Nếu ảnh có nền trắng chiếm >50%, coi như có nền → xóa nền
        const hasWhiteBackground = whiteRatio > 0.5;

        if (hasWhiteBackground) {
            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const alpha = pixels[i + 3];

                const brightness = (r + g + b) / 3;

                // ✅ Chỉ xóa nếu alpha đầy (255) & brightness cao
                if (alpha === 255 && brightness > 245) {
                    pixels[i + 3] = 0;
                } else if (alpha === 255 && brightness > 230) {
                    pixels[i + 3] = 80; // bán trong suốt
                }
            }
        }

        // ✅ Convert grayscale
        image.greyscale();

        // ✅ Increase contrast
        image.contrast(0.3);

        // ✅ Đảo màu nếu cần
        // if (colorOption?.toLowerCase() === 'white') {
            image.invert();
        // }

        return await image.getBuffer('image/png');
    } catch (error) {
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

        return new Response(processedBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': 'inline; filename="processed.png"',
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
