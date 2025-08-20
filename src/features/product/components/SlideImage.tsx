'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/src/components/ui/Button';

type SlideImageProps = {
  images: string[];
};

export default function SlideImage({ images }: SlideImageProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType>();
  const [activeIndex, setActiveIndex] = useState(0);

  const thumbRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (thumbRefs.current[activeIndex]) {
      thumbRefs.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeIndex]);

  return (
    <>
      <div className='relative flex w-full flex-col gap-3'>
        {/* Label */}
        <div className='bg-red absolute top-2.5 left-2.5 z-10 rounded-xl px-3 py-1 text-sm text-white lg:top-5 lg:left-5'>
          BESTSELLER
        </div>

        {/* Main Swiper */}
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          className='w-full overflow-hidden rounded-[20px]'
        >
          {images.map((img, i) => (
            <SwiperSlide
              key={i}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className='overflow-hidden rounded-[20px] bg-white'
            >
              <div className='flex justify-center'>
                <Image
                  src={img}
                  alt={`Slide ${i}`}
                  width={600}
                  height={600}
                  className='max-h-[665px] object-contain p-2'
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom dot wrapper */}
        <div className='absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 justify-center gap-1 rounded-4xl bg-black/50 px-2.5 py-2 md:hidden'>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => swiper?.slideTo(i)}
              className={`h-2 w-2 rounded-full bg-white ${i === activeIndex ? '' : 'opacity-40'}`}
            />
          ))}
        </div>

        {/* Thumbnail - Navigation buttons */}
        <div className='hidden w-full items-center justify-between gap-5 md:flex'>
          <div className='flex-1 overflow-x-hidden'>
            <div className='_hide_scrollbar flex items-stretch gap-3 overflow-x-auto'>
              {images.map((img, i) => (
                <Image
                  key={`thumb-${i}`}
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  src={img}
                  width={90}
                  height={90}
                  className={clsx(
                    'aspect-square w-[90px] flex-shrink-0 cursor-pointer rounded-xl bg-white object-contain p-1 transition duration-300',
                    i === activeIndex && 'border-brown border-2',
                  )}
                  alt={`Thumbnail ${i}`}
                  onClick={() => {
                    swiper?.slideTo(i);
                    setActiveIndex(i);
                  }}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-shrink-0 items-center gap-2'>
            <Button
              variant='white'
              className='border-brown h-10 w-10 rounded-full border-3 bg-white/50 !p-0 transition hover:bg-white lg:h-12 lg:w-12'
              onClick={() => swiper?.slidePrev()}
            >
              <ChevronLeft className='text-brown h-6 w-6 lg:h-8 lg:w-8' />
            </Button>
            <Button
              variant='white'
              className='border-brown h-10 w-10 rounded-full border-3 bg-white/50 !p-0 transition hover:bg-white lg:h-12 lg:w-12'
              onClick={() => swiper?.slideNext()}
            >
              <ChevronRight className='text-brown h-6 w-6 lg:h-8 lg:w-8' />
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({ src: img }))}
      />
    </>
  );
}
