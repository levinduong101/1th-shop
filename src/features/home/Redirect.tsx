'use client';

import AnimatedSingleElement from '@/src/components/ui/AnimatedSingleElement';
import { Button } from '@/src/components/ui/Button';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import Image from 'next/image';
import { useMemo } from 'react';

export default function Redirect() {
  const checkoutStore = useCheckoutStore((state) => state.formStore);
  const hasPinCode = useMemo(() => checkoutStore?.pinCode, [checkoutStore?.pinCode]);

  return (
    <div className='relative mb-[100px] flex w-full max-w-[560px] flex-col gap-3'>
      <AnimatedSingleElement animation='fadeUp'>
        <Button
          fullWidth
          variant='white'
          href='/design-product'
          animation='scaleIn'
          disabled={!hasPinCode}
        >
          DESIGN YOUR TEAM HOODIE
        </Button>
      </AnimatedSingleElement>
      <AnimatedSingleElement animation='fadeUp' delay={0.3}>
        <Button
          fullWidth
          variant='black'
          href='/upload-video'
          animation='scaleIn'
          disabled={!hasPinCode}
        >
          SUBMIT A TEAM VIDEO
        </Button>
      </AnimatedSingleElement>
      <Image
        priority
        src='/images/home/bottom.svg'
        width={135}
        height={135}
        alt='Chefs Bottom Image'
        className='absolute right-0 -bottom-1/4 aspect-square w-[135px] translate-y-1/2 lg:-right-8 lg:w-[200px]'
      />
    </div>
  );
}
