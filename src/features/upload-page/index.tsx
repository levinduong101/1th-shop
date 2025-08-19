import clsx from 'clsx';
import Image from 'next/image';

import Container from '@/src/components/ui/Container';
import Divider from '@/src/components/ui/divider';

import Form from './Form';

export default function UploadView() {
  return (
    <div className='_padding_top w-full overflow-x-hidden'>
      <Container className='grid place-items-center pb-18 md:grid-cols-2 lg:pt-6 lg:pb-20'>
        <Image
          src='/images/upload-page/title.svg'
          width={192}
          height={121}
          alt='DÜSSEL DORF KOCHT AUF'
          className='w-[192px] md:w-52 lg:w-[278px]'
        />
      </Container>

      <div className='relative'>
        <Divider rows={4} cellSize={25} lgChangeSize={36} className='h-max' />
        <Image
          src='/images/upload-page/chelf_icon.svg'
          width={356}
          height={248}
          alt='Page icon'
          className={clsx(
            'absolute top-0 left-1/2 w-[356px] -translate-x-[43.5%] -translate-y-[40%]',
            '3xl:w-[705px] md:w-[375px] md:-translate-x-[10%] lg:w-[500px] lg:-translate-y-[43%]',
          )}
        />
      </div>

      {/* Submit video */}
      <div className='mx-auto mt-15 flex max-w-[1143px] flex-col gap-3 pb-[70px] lg:mt-11.5 lg:gap-13 lg:pb-20'>
        <div className='col-span-full flex items-center gap-5.5 pr-3'>
          <Image
            src='/images/upload-page/arrow_right.svg'
            width={96}
            height={35}
            alt='Arrow right'
            className='h-auto w-24'
          />
          <h2 className='font-ccep-wide 3xl:text-[50px] text-[35px] leading-[1.2] font-bold lg:text-[40px]'>
            Submit Your
            <br />
            Team Video
          </h2>
        </div>

        <Container className='w-full lg:!px-0'>
          <Form />
        </Container>
      </div>
    </div>
  );
}
