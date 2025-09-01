import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://merch-base.prowerb.digital';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const video_id = searchParams.get('video_id');
    const customer_id = searchParams.get('customer_id');
    const pin_code = searchParams.get('pin_code');

    if (!video_id || !customer_id || !pin_code) {
      return NextResponse.json(
        { error: 'Missing required query parameters: video_id, customer_id, pin_code' },
        { status: 400 },
      );
    }

    const response = await axios.get(`${API_URL}/rest/V1/video/submitted`, {
      params: {
        video_id,
        customer_id,
        pin_code,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    return NextResponse.json({ data: response.data }, { status: response.status });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Magento API error:', error.message);

    return NextResponse.json(
      {
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 },
    );
  }
}
