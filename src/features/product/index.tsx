import Container from '@/src/components/ui/Container';
import SlideImage from './components/SlideImage';
import Form from './components/Form';

const images = [
  '/images/product-page/product.png',
  '/images/product-page/product.png',
  '/images/product-page/product.png',
];

export default function ProductView() {
  return (
    <Container className='_padding_top 3xl:grid-cols-[60%_1fr] mt-4 mb-36 grid w-full grid-cols-1 gap-x-5 gap-y-3 overflow-x-hidden md:grid-cols-2 lg:mb-42'>
      {/* Slide image */}
      <div className='w-full'>
        <SlideImage images={images} />
      </div>

      {/* Design */}
      <div className='flex w-full flex-col rounded-[28px] bg-white p-3.5 lg:p-5'>
        <h1 className='font-ccep-wide text-2xl font-medium lg:text-3xl'>
          Coca-Cola Classic Hoodie
        </h1>
        <p className='font-light lg:text-xl'>Unisex Hoodie available in red, grey and navy.</p>

        <div className='my-4.5 h-[1px] w-full bg-[#F1F2F3]' />

        {/* Form */}
        <Form />
      </div>
    </Container>
  );
}
