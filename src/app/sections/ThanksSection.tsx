'use client';
import { JSX } from 'react';

import Footer from '../components/Footer';
import Logo from '../components/Logo';

interface ThanksSectionProps {
  onChangePage: (type: 'next' | 'home') => void;
}

function ThanksSection({ onChangePage }: ThanksSectionProps): JSX.Element {
  return (
    <div className='page-padding relative flex flex-col items-center gap-[30px] overflow-hidden'>
      {/* heading */}
      <Logo />

      {/* content */}
      <div className='flex grow flex-col items-center justify-center gap-[10px] px-[12px]'>
        <h1 className={`end-heading text-center text-white`}>DANKE SCHÖN!</h1>
        <p className='end-text font-unity-medium text-center text-white'>
          Dein personalisiertes Shirt
          <br />
          ist unterwegs – trage es mit
          <br />
          Stolz und teile den
          <br />
          Coca-Cola Spirit!
        </p>
      </div>

      {/* footer */}
      <Footer onChangePage={onChangePage} hideButton={true} />
    </div>
  );
}

export default ThanksSection;
