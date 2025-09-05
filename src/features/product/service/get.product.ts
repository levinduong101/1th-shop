import { apiGraphQLServer } from '@/src/lib/api-graphql-server';

const PRODUCT_QUERY = `
query Products($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
        items {
            id
            name
            sku
            description {
                html
            }
            image {
                url
                label
            }
            small_image {
                url
                label
            }
            thumbnail {
                url
                label
            }
            media_gallery {
                url
                label
                position
                disabled
            }
            ... on CustomizableProductInterface {
                options {
                    option_id
                    required
                    sort_order
                    title
                    __typename
                    ... on CustomizableDropDownOption {
                        value {
                            option_type_id
                            title
                            price
                            price_type
                        }
                    }
                    ... on CustomizableRadioOption {
                        value {
                            option_type_id
                            title
                            price
                            price_type
                        }
                    }
                    ... on CustomizableCheckboxOption {
                        value {
                            option_type_id
                            title
                            price
                            price_type
                        }
                    }
                    ... on CustomizableMultipleOption {
                        value {
                            option_type_id
                            title
                            price
                            price_type
                        }
                    }
                    ... on CustomizableFileOption {
                        product_sku
                    }
                }
            }
        }
    }
}
`;

export interface ProductImage {
  url: string;
  label: string | null;
}

export interface MediaGalleryItem {
  url: string;
  label: string | null;
  position: number;
  disabled: boolean;
}

export interface ProductOptionValue {
  option_type_id: number;
  title: string;
  price: number;
  price_type: string;
}

export interface ProductOption {
  option_id: number;
  required: boolean;
  sort_order: number;
  title: string;
  __typename: string; // "CustomizableDropDownOption" | "CustomizableFieldOption" | ...
  value?: ProductOptionValue[];
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: {
    html: string;
  };
  image: ProductImage;
  small_image: ProductImage;
  thumbnail: ProductImage;
  media_gallery: MediaGalleryItem[];
  options?: ProductOption[];
}

interface ProductResponse {
  products: {
    items: Product[];
  };
}

export async function getProduct(sku: string, locale: string): Promise<Product | null> {
  const data = await apiGraphQLServer<ProductResponse>(
    PRODUCT_QUERY,
    locale,
    { sku },
    { revalidate: 60 },
  );

  return data?.products?.items?.[0] ?? null;
}
