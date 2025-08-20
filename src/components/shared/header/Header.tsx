import Image from 'next/image';
import Link from 'next/link';

import Menu from './Menu';
import Container from '../../ui/Container';

export default function Header() {
  return (
    <header className='fixed top-0 right-0 left-0 z-51'>
      <Container className='flex items-stretch justify-between py-4'>
        <Menu />

        <Link href='/landing' className='bg-pink flex items-center rounded-full pl-2'>
          <Image
            src='/images/coca_cola_logo_red.svg'
            width={233}
            height={42}
            alt='Coca Cola Logo'
            className='h-9 w-auto lg:h-10.5'
          />
        </Link>
      </Container>
    </header>
  );
}
