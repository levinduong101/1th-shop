import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://merch-base.prowerb.digital';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing required query parameter: id' }, { status: 400 });
    }

    const query = `
            query {
                getPersonalizeHoodieOrderById(personalizehoodieorder_id: "${id}") {
                    personalizehoodieorder_id
                    product_id
                    product_sku
                    employee_id
                    color
                    logo
                    restaurant_name
                    qty
                    custom_name
                    request_size
                    employee_firstname
                    employee_lastname
                    email
                    phone
                    street
                    street2
                    region
                    postcode
                    city
                    country
                    customer_id
                    order_id
                    creation_time
                    update_time
                    status
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
