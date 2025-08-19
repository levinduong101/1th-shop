'use client';
import Image from 'next/image';
import { JSX } from 'react';

function Logo(): JSX.Element {
  return <Image src={'/images/logo.png'} width={235} height={119} alt='logo' />;
}

export default Logo;
