'use client';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';

import Container from '../../ui/Container';
import { BottleCapIcon, CloseIcon, MenuIcon } from '../../ui/Icons';

const bottleSize = 47;

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const onToggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  return (
    <>
      <Mapping onToggleMenu={onToggleMenu}>
        <MenuIcon width={18} height={18} fill='white' className='lg:h-7.5 lg:w-7.5' />
      </Mapping>

      {/* Dropdown menu */}
      <div
        className={clsx(
          'bg-pink absolute right-0 left-0 z-20 pb-5 shadow transition-all duration-300 ease-in-out',
          isOpen ? 'top-0' : 'bottom-full opacity-0',
        )}
      >
        <Container className='flex items-center justify-between py-4'>
          <Mapping onToggleMenu={onToggleMenu}>
            <CloseIcon fill='white' className='lg:h-12 lg:w-12' />
          </Mapping>

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

        <Container className='mt-5 flex flex-col'>
          <Link
            href='/design-product'
            className='font-ccep-wide group hover:text-red flex items-center px-5 py-2.5 text-lg font-bold lg:text-3xl'
            onClick={onToggleMenu}
          >
            Design Your Team Hoodie
            <ArrowRight
              strokeWidth={3}
              className={'w-0 transition-all duration-300 group-hover:ml-1 group-hover:w-8'}
            />
          </Link>
          <Link
            href='/upload-video'
            className='font-ccep-wide group hover:text-red flex items-center px-5 py-2.5 text-lg font-bold lg:text-3xl'
            onClick={onToggleMenu}
          >
            Submit a Team Video
            <ArrowRight
              strokeWidth={3}
              className={'w-0 transition-all duration-300 group-hover:ml-1 group-hover:w-8'}
            />
          </Link>
        </Container>
      </div>
    </>
  );
}

/** Helper */
const Mapping = ({
  children,
  onToggleMenu,
}: {
  children: React.ReactNode;
  onToggleMenu: () => void;
}) => {
  return (
    <div
      className={`relative z-10 flex aspect-square cursor-pointer items-center justify-center select-none lg:!w-[70px]`}
      style={{ width: bottleSize + 'px' }}
      onClick={onToggleMenu}
    >
      {children}

      <BottleCapIcon
        width={bottleSize}
        height={bottleSize}
        className='absolute inset-0 -z-1 h-full w-full'
      />
    </div>
  );
};
