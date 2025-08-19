'use client';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';

import Button from './Button';

interface FooterProps {
  onChangePage: (type: 'next' | 'home') => void;
  hideButton?: boolean;
  buttonText?: string;
  className?: string;
}

function Footer({
  onChangePage,
  hideButton = false,
  buttonText,
  className = '',
}: FooterProps): JSX.Element {
  return (
    <div className={`flex w-full flex-col items-center gap-[18px] !py-0 ${className}`}>
      {hideButton ? (
        <p className={`end-sub font-unity-regular text-center text-black`}>
          Eine Bestätigungs-E-Mail mit allen
          <br />
          Details ist bereits auf dem Weg zu dir.
        </p>
      ) : (
        <Button onclick={() => onChangePage('next')}>{buttonText}</Button>
      )}
      <Link href='/' onClick={() => onChangePage('home')}>
        <Image src={'/images/Stacked_Logo.png'} width={108} height={73} alt='stacked logo' />
      </Link>
    </div>
  );
}

export default Footer;
