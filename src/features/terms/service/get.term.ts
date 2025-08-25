const API_URL = process.env.API_URL || 'https://merch-base.prowerb.digital';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

const CMS_PAGE_QUERY = `
  query CmsPage($identifier: String!) {
    cmsPage(identifier: $identifier) {
      content
      content_heading
      identifier
      meta_description
      meta_keywords
      meta_title
      page_layout
      relative_url
      title
      url_key
    }
  }
`;

export interface CmsPage {
  content: string;
  content_heading: string;
  identifier: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  page_layout: string;
  relative_url: string;
  title: string;
  url_key: string;
}

interface CmsPageResponse {
  cmsPage: CmsPage;
}

export async function getTerms() {
  try {
    const res = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'tenant-domain': 'ccep',
      },
      body: JSON.stringify({
        query: CMS_PAGE_QUERY,
        variables: {
          identifier: 'privacy-policy-cookie-restriction-mode',
        },
      }),
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const { data }: { data: CmsPageResponse } = await res.json();
    if (!data?.cmsPage) {
      throw new Error('Invalid response format');
    }

    return data.cmsPage;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching terms:', error);
    return null;
  }
}
