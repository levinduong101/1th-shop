import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://merch-base.prowerb.digital';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      product_sku,
      request_size,
      color,
      logo,
      employee_id,
      restaurant_name,
      email,
      phone,
      street,
      city,
      postcode,
    } = body;

    // Build GraphQL mutation dynamically
    const mutation = `
      mutation {
        createPersonalizeHoodieOrder(
          product_sku: "${product_sku}",
          request_size: "${request_size}",
          color: "${color}",
          logo: "${logo}",
          employee_id: "${employee_id}",
          restaurant_name: "${restaurant_name}",
          email: "${email}",
          phone: "${phone}",
          street: "${street}",
          city: "${city}",
          postcode: "${postcode}"
        ) {
          personalizehoodieorder_id
          product_sku
          request_size
          color
          restaurant_name
          logo
          employee_id
          email
          phone
          street
          city
          postcode
        }
      }
    `;

    const response = await axios.post(
      `${GRAPHQL_URL}/graphql`,
      { query: mutation },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      },
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('GraphQL mutation error:', error);

    return NextResponse.json(
      {
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 },
    );
  }
}
