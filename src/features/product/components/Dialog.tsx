'use client';

import { useEffect, useRef } from 'react';
import Container from '@/src/components/ui/Container';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { ProductFormValues } from '../validation/schema';
import { FieldValues } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { UploadSimpleIcon } from '@/src/components/ui/Icons';
import gsap from 'gsap';
import Image from 'next/image';
import Input from '@/src/components/ui/Input';

type DialogProps<T extends FieldValues = ProductFormValues> = {
  showProductPopup: (ProductFormValues & { isImage?: boolean }) | null;
  setShowProductPopup: (open: ProductFormValues | null) => void;
  control: Control<T>;
  register: UseFormRegister<{
    size: string;
    name: string;
    file: File;
  }>;
  file?: File | null;
};

const MIN_FONT = 10;
const MAX_FONT = 18;

export default function DialogCustom({
  control,
  setShowProductPopup,
  showProductPopup,
  file,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  /** Animation when open */
  useEffect(() => {
    const isVisible = !!showProductPopup;
    if (dialogRef.current) {
      dialogRef.current.style.display = isVisible ? 'block' : 'none';
    }

    if (isVisible && dialogRef.current) {
      gsap.fromTo(
        dialogRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' },
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };
    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showProductPopup?.isImage, showProductPopup?.name]);

  /** Animation before close */
  const handleClose = () => {
    if (dialogRef.current) {
      gsap.to(dialogRef.current, {
        opacity: 0,
        x: -100,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setShowProductPopup(null);
          dialogRef.current!.style.display = 'none';
          gsap.set(dialogRef.current, { x: 0 }); // reset position for next open
        },
      });
    }
  };

  /** Tracking text */
  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;

    const resize = () => {
      if (!el) return;
      let currentSize = MAX_FONT;

      // reset về max font trước khi đo
      el.style.fontSize = `${currentSize}px`;

      while (
        (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) &&
        currentSize > MIN_FONT
      ) {
        currentSize -= 1;
        el.style.fontSize = `${currentSize}px`;
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(el);

    resize(); // chạy lần đầu

    return () => observer.disconnect();
  }, [showProductPopup?.name]);

  return (
    <div ref={dialogRef} className='fixed inset-0 z-100 hidden bg-white'>
      <Container
        className={clsx(
          '3xl:pt-20 3xl:pb-12.5 pt-5 pb-2.5 md:pt-10 md:pb-5 lg:pt-15 lg:pb-8',
          'flex h-full flex-col gap-10',
        )}
      >
        <Button
          variant='white'
          className='h-12 w-12 flex-shrink-0 rounded-full border-3 !p-0'
          onClick={handleClose}
        >
          <ArrowLeft />
        </Button>

        {/* Image */}
        <div className='grid flex-1 place-items-center'>
          <div className='relative h-full'>
            <Image
              src='/images/product-page/product.png'
              width={500}
              height={500}
              alt='Product Image'
              className='h-full w-auto object-contain'
            />

            {(file || showProductPopup?.name) && (
              <div className='absolute inset-0 z-10 flex items-center justify-center'>
                <div
                  className={clsx(
                    'flex aspect-[566/300] w-2/5 translate-y-[10%] flex-col gap-1',
                    file && showProductPopup?.isImage ? 'justify-center' : '',
                  )}
                >
                  {file && showProductPopup?.isImage && (
                    <div className='w-full flex-1'>
                      <Image
                        src={URL.createObjectURL(file)}
                        alt='Uploaded File'
                        width={100}
                        height={100}
                        className='mx-auto max-h-full border-2 border-blue-600 object-contain'
                      />
                    </div>
                  )}
                  {showProductPopup?.name && (
                    <div
                      ref={nameRef}
                      className='text-brown flex-shrink-0 text-center font-extrabold text-nowrap'
                    >
                      {showProductPopup.name}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className='flex w-full flex-shrink-0 flex-col items-center justify-center gap-3 md:flex-row'>
          {showProductPopup?.isImage && (
            <div className='w-full max-w-[352px]'>
              <Controller
                name='file'
                control={control}
                rules={{ required: 'File is required' }}
                render={({ field: { onChange, name } }) => (
                  <Input
                    type='file'
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        onChange(e.target.files[0]);
                      }
                    }}
                    name={name}
                    render={({ trigger }) => (
                      <Button
                        type='button'
                        variant='white'
                        fullWidth
                        className='flex h-13 items-center justify-center gap-2 text-sm'
                        onClick={trigger}
                      >
                        <span>UPLOAD FILES</span>
                        <UploadSimpleIcon />
                      </Button>
                    )}
                  />
                )}
              />
            </div>
          )}
          <Button type='button' variant='brown' fullWidth className='h-13 max-w-[352px] text-sm'>
            <span>PROCEED TO CHECKOUT</span>
            <ChevronRight height={20} />
          </Button>
        </div>
      </Container>
    </div>
  );
}
