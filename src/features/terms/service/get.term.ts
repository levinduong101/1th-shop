import { apiGraphQLServer } from '@/src/lib/api-graphql-server';

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
  const data = await apiGraphQLServer<CmsPageResponse>(CMS_PAGE_QUERY, 'en', {
    identifier: 'privacy-policy-cookie-restriction-mode',
  });

  return data?.cmsPage ?? null;
}
