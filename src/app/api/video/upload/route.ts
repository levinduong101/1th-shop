import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://merch-base.prowerb.digital';
const ACCESS_TOKEN = process.env.ACCESS_UPLOAD_TOKEN || '';

export async function POST(req: NextRequest) {
  try {
    const uploadPath = '/rest/V1/video/upload';
    const url = `${API_URL}${uploadPath}`;

    // Prepare headers
    const headers: Record<string, string> = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    };

    // Forward essential headers
    const headersToForward = ['content-type', 'accept', 'user-agent', 'content-length'];
    headersToForward.forEach((headerName) => {
      const headerValue = req.headers.get(headerName);
      if (headerValue) {
        headers[headerName] = headerValue;
      }
    });

    let data: any = undefined;
    const contentType = req.headers.get('content-type') || '';

    // Handle different content types
    if (contentType.includes('multipart/form-data')) {
      // For file uploads, get FormData
      data = await req.formData();
    } else if (contentType.includes('application/json')) {
      // For JSON data
      data = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // For form data
      const text = await req.text();
      data = text;
    } else {
      // For other binary data (direct file upload)
      data = await req.arrayBuffer();
    }

    const response = await axios({
      url,
      method: 'POST',
      headers,
      data,
      timeout: 300000, // 5 minutes timeout for file uploads
      validateStatus: () => true, // Don't throw on HTTP error status
    });

    // Prepare response headers
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', response.headers['content-type'] || 'application/json');

    // Forward useful response headers
    const responseHeadersToForward = [
      'cache-control',
      'etag',
      'expires',
      'x-ratelimit-remaining',
      'x-ratelimit-limit',
    ];
    responseHeadersToForward.forEach((headerName) => {
      if (response.headers[headerName]) {
        responseHeaders.set(headerName, response.headers[headerName]);
      }
    });

    // Return response
    return new NextResponse(JSON.stringify(response.data), {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Upload proxy error:', error);

    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      return NextResponse.json(
        {
          error: 'Upload timeout',
          message: 'The upload request took too long to complete',
        },
        { status: 408 },
      );
    }

    if (error.code === 'ENOTFOUND') {
      return NextResponse.json(
        {
          error: 'API server not found',
          message: 'Could not connect to the upload server',
        },
        { status: 502 },
      );
    }

    if (error.response) {
      // API returned an error response
      return NextResponse.json(
        {
          error: error.response.data || error.message,
          status: error.response.status,
          statusText: error.response.statusText,
        },
        { status: error.response.status },
      );
    }

    if (error.request) {
      // Request was made but no response received
      return NextResponse.json(
        {
          error: 'No response from server',
          message: 'The upload server did not respond',
        },
        { status: 503 },
      );
    }

    // Other errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred during upload',
      },
      { status: 500 },
    );
  }
}
