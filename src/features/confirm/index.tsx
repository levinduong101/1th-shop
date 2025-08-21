import AnimatedSingleElement from '@/src/components/ui/AnimatedSingleElement';
import AnimatedText from '@/src/components/ui/AnimatedText';
import { Button } from '@/src/components/ui/Button';
import Container from '@/src/components/ui/Container';
import Divider from '@/src/components/ui/divider';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export default function ConfirmView() {
  return (
    <section className='flex min-h-dvh w-full flex-col overflow-hidden'>
      <Container className='3xl:my-[188px] relative z-50 my-28 flex flex-col items-center gap-4 text-white'>
        <AnimatedSingleElement animation='fromLeft'>
          <Link href='/landing' className='flex items-center rounded-full pl-2'>
            <Image
              src='/images/coca_cola_logo.svg'
              width={233}
              height={42}
              alt='Coca Cola Logo'
              className='h-9 w-auto lg:h-10.5'
            />
          </Link>
        </AnimatedSingleElement>

        <AnimatedText
          as='h1'
          className='font-ccep-narrow text-[40px] leading-[1] md:text-[50px] lg:text-[60px]'
          animation='fromRight'
          split='words'
          duration={0.5}
        >
          Thank You for Your Order :)
        </AnimatedText>

        <AnimatedText
          as='p'
          className='text-xl font-light lg:text-[24px]'
          duration={0.5}
          split='words'
          animation='fadeIn'
        >
          Your order has been successfully placed.
        </AnimatedText>

        {/* Buttons */}
        <div className='flex w-full max-w-[380px] flex-col gap-3'>
          <AnimatedSingleElement animation='fadeUp'>
            <Button fullWidth variant='black' href='/upload-video' animation='scaleIn'>
              SUBMIT A TEAM VIDEO
            </Button>
          </AnimatedSingleElement>
          <AnimatedSingleElement animation='fadeUp' delay={0.3}>
            <Button fullWidth variant='white' href='/design-product' animation='scaleIn'>
              DESIGN YOUR TEAM HOODIE
            </Button>
          </AnimatedSingleElement>
        </div>

        {/* Images */}
        <Image
          src='/images/confirm/table.svg'
          width={347}
          height={266}
          alt='Chefs -Table'
          className={clsx(
            'absolute top-[112%] left-1/2 z-10 h-[218px] w-[284px] -translate-x-1/2',
            'lg:right-1/2 lg:left-[unset] lg:h-[266px] lg:w-[347px] lg:-translate-x-2/3',
          )}
        />
        <Image
          src='/images/confirm/chefs1.svg'
          width={161}
          height={210}
          alt='Chefs 1'
          className={clsx(
            'absolute top-[142%] right-[62%] z-11 h-[210px] w-[161px]',
            'lg:-top-1/5 lg:right-[72%] lg:h-[191px] lg:w-[146px]',
          )}
        />
        <Image
          src='/images/home/right.svg'
          width={180}
          height={255}
          alt='Chefs 2'
          className={clsx(
            'absolute top-[180%] left-[75%] h-[164px] w-[115px]',
            'lg:top-[150%] lg:right-1/2 lg:left-[unset] lg:h-[255px] lg:w-[180px] lg:translate-x-[150%]',
          )}
        />
        <Image
          src='/images/confirm/bottle.svg'
          width={251}
          height={251}
          alt='Chefs 3'
          className={clsx('absolute top-1/4 right-1/2 hidden translate-x-[220%]', 'lg:block')}
        />
      </Container>

      <Divider direction='horizontal' />

      <div className='bg-brown relative w-full flex-1'>
        <div className='_bg absolute inset-0 z-10' />
      </div>
    </section>
  );
}
