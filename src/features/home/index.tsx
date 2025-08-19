import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/src/components/ui/Button';
import Container from '@/src/components/ui/Container';
import Divider from '@/src/components/ui/divider';
import { XIcon } from '@/src/components/ui/Icons';

export default function HomeView() {
  return (
    <section className='grid min-h-screen w-full lg:grid-cols-[1fr_max-content_1fr]'>
      {/* Image Left */}
      <div className='relative hidden w-full lg:block'>
        <Image
          src='/images/home/bg.jpg'
          layout='fill'
          alt='Background Image'
          className='object-cover'
        />
      </div>

      <div className='relative hidden h-full w-12.5 bg-black lg:block'>
        <Divider cols={2} cellSize={25} className='absolute inset-0' />
      </div>

      {/* Right */}
      <div className='flex h-full w-full flex-col'>
        <div className='bg-brown flex w-full flex-col items-center'>
          <div className='3xl:pt-20 relative flex w-max flex-col items-center gap-2 pt-15 pb-23 lg:gap-3 lg:pt-17.5 lg:pb-25'>
            <Image
              src='/images/coca_cola_logo.svg'
              width={233}
              height={42}
              alt='Coca Cola Logo'
              className='3xl:w-[350px] lg:w-[280px]'
              priority
            />
            <XIcon className='3xl:px-2.5 px-3.5 lg:px-3' />

            <Image
              priority
              src='/images/metro_logo.svg'
              width={233}
              height={42}
              alt='Metro Logo'
              className='3xl:w-[350px] 3xl:px-5.5 px-3 lg:w-[280px]'
            />
            <XIcon className='3xl:px-2.5 px-3.5 lg:px-3' />

            <Image
              priority
              src='/images/chefs_logo.svg'
              width={233}
              height={42}
              alt='Chefs Logo'
              className='3xl:w-[350px] 3xl:px-7.5 px-4.5 lg:w-[280px]'
            />

            <Image
              priority
              src='/images/home/left.svg'
              width={125}
              height={154}
              alt='Chefs Left Image'
              className={clsx(
                'absolute bottom-0 -left-9 aspect-[125/154] w-[125px] translate-y-1/2',
                'lg:-left-15 lg:w-37.5 lg:translate-y-1/3',
                '3xl:w-[194px] 3xl:-left-36 3xl:translate-y-1/4',
              )}
            />

            <Image
              src='/images/home/right.svg'
              width={76}
              height={108}
              alt='Chefs Right Image'
              className={clsx(
                'absolute -right-10 bottom-0 w-[76px] translate-y-[15%]',
                'lg:w-22',
                '3xl:w-[120px] 3xl:-right-25',
              )}
            />
          </div>
        </div>

        <div className='w-full flex-1'>
          <Divider rows={2} cellSize={25} className='h-max lg:hidden' />

          <Container className='mt-8 flex flex-col items-center gap-3.5 lg:mt-18 lg:gap-6'>
            <div className='max-w-[700px] text-center text-white'>
              <h1 className='text-3xl font-bold lg:text-6xl'>Let&#39;s Get Started!</h1>
              <p className='font-ccep-wide mt-3 text-sm lg:text-base'>
                Welcome. This is your personal entry to the Coca-Cola × Metro Chefs in Town
                campaign. Please choose an option below to begin.
              </p>
            </div>

            <div className='relative mb-[100px] flex w-full max-w-[560px] flex-col gap-3 lg:mb-[150px]'>
              <Button fullWidth variant='white' href='/design-product' arrowAnimation>
                DESIGN YOUR TEAM HOODIE
              </Button>
              <Button fullWidth variant='black' href='/upload-video' arrowAnimation>
                SUBMIT A TEAM VIDEO
              </Button>

              <Image
                priority
                src='/images/home/bottom.svg'
                width={135}
                height={135}
                alt='Chefs Bottom Image'
                className='absolute right-0 -bottom-1/4 aspect-square w-[135px] translate-y-1/2 lg:-right-8 lg:w-[200px]'
              />
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
