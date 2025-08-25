import clsx from 'clsx';
import Image from 'next/image';

import Container from '@/src/components/ui/Container';
import Divider from '@/src/components/ui/divider';

import Form from './Form';
import AnimatedSingleElement from '@/src/components/ui/AnimatedSingleElement';

export default function UploadView() {
  return (
    <div className='_padding_top w-full overflow-x-hidden'>
      <Container className='grid place-items-center pb-18 md:grid-cols-2 lg:pt-6 lg:pb-20'>
        <AnimatedSingleElement animation='fromLeft'>
          <Image
            src='/images/upload-page/title.svg'
            width={192}
            height={121}
            alt='DÜSSEL DORF KOCHT AUF'
            className='w-[192px] md:w-52 lg:w-[278px]'
            priority
          />
        </AnimatedSingleElement>
      </Container>

      <div className='relative'>
        <Divider largeChange nums={4} speed={0.5} direction='horizontal' />

        <div
          className={clsx(
            'absolute top-0 left-1/2 w-[356px] -translate-x-[43.5%] -translate-y-[40%]',
            '3xl:w-[705px] md:w-[375px] md:-translate-x-[10%] lg:w-[500px] lg:-translate-y-[43%]',
          )}
        >
          <AnimatedSingleElement animation='fromRight'>
            <Image
              src='/images/upload-page/chelf_icon.svg'
              width={356}
              height={248}
              alt='Page icon'
              className={clsx('w-[356px]', '3xl:w-[705px] md:w-[375px] lg:w-[500px]')}
              priority
            />
          </AnimatedSingleElement>
        </div>
      </div>

      {/* Submit video */}
      <Form />
    </div>
  );
}
