import ProductView from '@/src/features/product';
import { getProduct } from '@/src/features/product/service/get.product';

export default async function page() {
  const sku = process.env.NEXT_PUBLIC_PRODUCT_SKU || '';
  const product = await getProduct(sku, 'en');

  return <ProductView product={product} />;
}
