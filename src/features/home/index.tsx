import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

import Container from '@/src/components/ui/Container';
import Divider from '@/src/components/ui/divider';
import { XIcon } from '@/src/components/ui/Icons';
import AnimatedSingleElement from '@/src/components/ui/AnimatedSingleElement';
import AnimatedText from '@/src/components/ui/AnimatedText';
import Popup from './Popup';
import Redirect from './Redirect';

export default function HomeView() {
  return (
    <>
      <section className='grid min-h-screen w-full overflow-y-hidden lg:grid-cols-[1fr_max-content_1fr]'>
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
          <Divider direction='vertical' className='absolute inset-0' speed={0.5} />
        </div>

        {/* Right */}
        <div className='flex h-full w-full flex-col'>
          <div className='bg-brown flex w-full flex-col items-center'>
            <div className='3xl:pt-20 relative flex w-max flex-col items-center gap-2 pt-15 pb-23 lg:gap-3 lg:pt-17.5 lg:pb-25'>
              <AnimatedSingleElement animation='fromRight'>
                <Image
                  src='/images/coca_cola_logo.svg'
                  width={233}
                  height={42}
                  alt='Coca Cola Logo'
                  className='3xl:w-[350px] lg:w-[280px]'
                  priority
                />
              </AnimatedSingleElement>
              <AnimatedSingleElement animation='fadeUp'>
                <XIcon className='3xl:px-2.5 px-3.5 lg:px-3' />
              </AnimatedSingleElement>

              <AnimatedSingleElement animation='fromLeft'>
                <Image
                  priority
                  src='/images/chefs_logo.svg'
                  width={233}
                  height={42}
                  alt='Chefs Logo'
                  className='3xl:w-[350px] 3xl:px-7.5 px-4.5 lg:w-[280px]'
                />
              </AnimatedSingleElement>

              <Image
                priority
                src='/images/home/left.svg'
                width={125}
                height={154}
                alt='Chefs Left Image'
                className={clsx(
                  'absolute bottom-0 -left-9 aspect-[125/154] w-[125px] translate-y-[45%]',
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
            <Divider direction='horizontal' speed={0.5} className='h-max lg:hidden' />

            <Container className='mt-8 flex flex-col items-center gap-3.5 lg:mt-18 lg:gap-6'>
              <div className='max-w-[700px] text-center text-white'>
                <AnimatedText
                  as='h1'
                  split='chars'
                  animation='fromRight'
                  className='font-ccep-narrow text-5xl font-bold lg:text-6xl'
                  duration={0.5}
                >
                  Let&#39;s Get Started!
                </AnimatedText>

                <AnimatedText
                  as='p'
                  split='words'
                  animation='fadeIn'
                  className='font-ccep-wide mt-3 text-sm font-normal lg:text-base'
                  duration={0.5}
                >
                  Welcome. This is your personal entry to the Coca-Cola × Metro Chefs in Town
                  campaign. Please choose an option below to begin.
                </AnimatedText>
              </div>

              <Redirect />
            </Container>
          </div>
        </div>
      </section>

      <Popup />
    </>
  );
}
