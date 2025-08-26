import ProductView from '@/src/features/product';
import { getProduct } from '@/src/features/product/service/get.product';

export default async function page() {
  const sku = process.env.PRODUCT_SKU || '';
  const product = await getProduct(sku);

  return <ProductView product={product} />;
}
