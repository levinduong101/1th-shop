import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'Missing url parameter' },
                { status: 400 }
            );
        }

        try {
            const url = new URL(imageUrl);
            if (!['http:', 'https:'].includes(url.protocol)) {
                return NextResponse.json(
                    { error: 'Invalid protocol' },
                    { status: 400 }
                );
            }
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid URL' },
                { status: 400 }
            );
        }

        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; NextJS-Proxy/1.0)',
                'Accept': 'image/*,*/*;q=0.8',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch image:', response.status, response.statusText);
            return NextResponse.json(
                {
                    error: 'Failed to fetch image',
                    status: response.status,
                    statusText: response.statusText
                },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type') || 'image/png';

        // Validate content type
        if (!contentType.startsWith('image/')) {
            return NextResponse.json(
                { error: 'URL does not point to an image' },
                { status: 400 }
            );
        }

        // Convert response -> arrayBuffer
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': buffer.byteLength.toString(),
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                // Cache for 1 hour
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error('Proxy image error:', error);

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}