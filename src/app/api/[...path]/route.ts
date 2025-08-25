import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://merch-base-dev.prowerb.digital';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

async function handleRequest(req: NextRequest) {
  const path = new URL(req.url).pathname.replace('/api', '');
  const url = `${API_URL}${path}`;
  const method = req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  const headers: Record<string, string> = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };

  const headersToForward = ['content-type', 'accept', 'user-agent'];
  headersToForward.forEach((headerName) => {
    const headerValue = req.headers.get(headerName);
    if (headerValue) {
      headers[headerName] = headerValue;
    }
  });

  let data: any = undefined;

  try {
    // Handle body data
    if (method !== 'GET' && method !== 'DELETE') {
      const contentType = req.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        data = await req.json();
      } else if (contentType.includes('multipart/form-data')) {
        data = await req.formData();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const text = await req.text();
        data = text;
      } else {
        data = await req.arrayBuffer();
      }
    }

    // Call API
    const response = await axios({
      url,
      method,
      headers,
      data,
      timeout: 30000,
      validateStatus: () => true,
    });

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', response.headers['content-type'] || 'application/json');

    const responseHeadersToForward = ['cache-control', 'etag', 'expires'];
    responseHeadersToForward.forEach((headerName) => {
      if (response.headers[headerName]) {
        responseHeaders.set(headerName, response.headers[headerName]);
      }
    });

    return new NextResponse(JSON.stringify(response.data), {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Proxy error:', error);

    if (error.code === 'ECONNABORTED') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 408 });
    }

    if (error.response) {
      return NextResponse.json(
        { error: error.response.data || error.message },
        { status: error.response.status },
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req);
}

export async function PATCH(req: NextRequest) {
  return handleRequest(req);
}
