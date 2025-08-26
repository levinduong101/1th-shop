import Container from '@/src/components/ui/Container';
import SlideImage from './components/SlideImage';
import Form from './components/Form';
import { Product } from './service/get.product';

export default function ProductView({ product }: { product: Product | null }) {
  return (
    <Container className='_padding_top 3xl:grid-cols-[60%_1fr] mt-4 mb-36 grid w-full grid-cols-1 gap-x-5 gap-y-3 overflow-x-hidden md:grid-cols-2 lg:mb-42'>
      {/* Slide image */}
      <div className='w-full'>
        <SlideImage images={product?.media_gallery || []} />
      </div>

      {/* Design */}
      <div className='flex w-full flex-col rounded-[28px] bg-white p-3.5 lg:p-5'>
        <h1 className='font-ccep-wide text-2xl font-medium lg:text-3xl'>{product?.name || ''}</h1>
        <div
          className='font-light lg:text-xl'
          dangerouslySetInnerHTML={{ __html: product?.description.html || '' }}
        />

        <div className='my-4.5 h-[1px] w-full bg-[#F1F2F3]' />

        {/* Form */}
        <Form product={product} />
      </div>
    </Container>
  );
}
