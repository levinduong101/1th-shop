const API_URL = process.env.API_URL || 'https://merch-base.prowerb.digital';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function apiGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  options?: { revalidate?: number },
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'tenant-domain': 'ccep',
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: options?.revalidate ?? 60 }, // default 60s
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const json: GraphQLResponse<T> = await res.json();
    if (json.errors) {
      // eslint-disable-next-line no-console
      console.error('GraphQL errors:', json.errors);
      return null;
    }

    return json.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('GraphQL fetch error:', error);
    return null;
  }
}
