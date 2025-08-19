import Image from 'next/image';
import Link from 'next/link';

import Menu from './Menu';
import Container from '../../ui/Container';

export default function Header() {
  return (
    <header className='bg-pink fixed top-0 right-0 left-0 z-50'>
      <Container className='flex items-center justify-between py-4'>
        <Menu />

        <Link href='/landing'>
          <Image
            src='/images/coca_cola_logo_red.svg'
            width={233}
            height={42}
            alt='Coca Cola Logo'
            className='h-9 lg:h-10.5'
          />
        </Link>
      </Container>
    </header>
  );
}
