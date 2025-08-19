'use client';
import { JSX } from 'react';

import Footer from '../components/Footer';
import Logo from '../components/Logo';

interface LandingProps {
  onChangePage: (type: 'next' | 'home') => void;
}

function LandingSection({ onChangePage }: LandingProps): JSX.Element {
  return (
    <div className='page-padding relative flex flex-col items-center justify-between overflow-hidden'>
      {/* BG */}
      <div className='absolute inset-0 -z-50 bg-[#F53228]' />

      {/* heading */}
      <div className=''>
        <Logo />
        <h1 className='end-heading text-center text-white'>T-SHIRT</h1>
      </div>

      {/* Video */}
      <div className='absolute top-1/2 left-1/2 -z-10 w-max -translate-x-1/2 -translate-y-1/2 transform'>
        <video
          className='!h-[754px] object-cover'
          autoPlay
          loop
          muted
          playsInline
          src='/videos/Coca_cola_shirt_Video.mp4'
        />
      </div>

      {/* footer */}
      <Footer onChangePage={onChangePage} buttonText='PERSONALISIEREN' />
    </div>
  );
}

export default LandingSection;
