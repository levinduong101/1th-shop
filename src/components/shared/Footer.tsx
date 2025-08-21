import Image from 'next/image';

import { XIcon } from '../ui/Icons';

export default function Footer() {
  return (
    <footer className='flex flex-col items-center gap-1 bg-black px-10 py-7.5 md:flex-row md:justify-center md:gap-7'>
      <Image
        src='/images/coca_cola_logo.svg'
        width={132}
        height={23}
        alt='Coca Cola Logo'
        className='md:w-[169px]'
      />
      <XIcon className='p-0.5 md:hidden' width={16} height={16} />

      {/* <Image
        src='/images/metro_logo.svg'
        width={118}
        height={22}
        alt='Metro Logo'
        className='md:w-[124px]'
      />
      <XIcon className='p-0.5 md:hidden' width={16} height={16} /> */}

      <Image
        src='/images/chefs_logo.svg'
        width={110}
        height={42}
        alt='Chefs Logo'
        className='md:w-[94px]'
      />
    </footer>
  );
}
