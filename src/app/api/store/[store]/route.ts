import { NextRequest, NextResponse } from 'next/server';

const STORES_FAKE = [
  {
    key: 'chefsintown',
    title: 'Chefs in Town',
    description:
      'Activation campaign platform for selected restaurants: branded hoodie orders & team video contest, powered by One-Click-Clothes-Store.',
  },
  {
    key: 'chefsintown2',
    title: 'Chefs in Town',
    description:
      'Activation campaign platform for selected restaurants: branded hoodie orders & team video contest, powered by One-Click-Clothes-Store.',
  },
];

export async function GET(req: NextRequest, props: { params: Promise<{ store: string }> }) {
  try {
    const params = await props.params;
    const store = params.store;

    const storeData = STORES_FAKE.find((s) => s.key === store);
    if (!storeData) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({ data: storeData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 },
    );
  }
}
