import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://merch-base.prowerb.digital';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pinCode } = body;

    const query = `
          query {
            getEmployeeByCcepNummer(ccep_nummer: "${pinCode}") {
              user {
                name
                email
              }
            }
          }
        `;

    const response = await axios.post(
      `${GRAPHQL_URL}/graphql`,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('GraphQL query error:', error);

    return NextResponse.json(
      {
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 },
    );
  }
}
