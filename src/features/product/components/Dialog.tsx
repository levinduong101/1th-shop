'use client';

import { useEffect, useRef } from 'react';
import Container from '@/src/components/ui/Container';
import { Control, Controller } from 'react-hook-form';
import { ProductFormValues } from '../lib/schema';
import { FieldValues } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { UploadSimpleIcon } from '@/src/components/ui/Icons';
import gsap from 'gsap';
import Image from 'next/image';
import Input from '@/src/components/ui/Input';

type DialogProps<T extends FieldValues = ProductFormValues> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  control: Control<T>;
  file?: File | null;
  error: string | undefined;
  imageUrl: string;
};

export default function DialogCustom({
  control,
  file,
  open,
  setOpen,
  error,
  imageUrl,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  /** Animation when open */
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.style.display = open ? 'block' : 'none';
    }

    if (open && dialogRef.current) {
      gsap.fromTo(
        dialogRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' },
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /** Animation before close */
  const handleClose = () => {
    if (dialogRef.current) {
      gsap.to(dialogRef.current, {
        opacity: 0,
        x: -100,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setOpen(false);
          dialogRef.current!.style.display = 'none';
          gsap.set(dialogRef.current, { x: 0 }); // reset position for next open
        },
      });
    }
  };

  return (
    <div ref={dialogRef} className='fixed inset-0 z-100 hidden bg-white'>
      <Container
        className={clsx(
          '3xl:pt-20 3xl:pb-12.5 pt-5 pb-2.5 md:pt-10 md:pb-5 lg:pt-15 lg:pb-8',
          'flex h-full flex-col gap-10',
        )}
      >
        {/* Back */}
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
              src={imageUrl}
              width={500}
              height={500}
              alt='Product Image'
              className='h-full w-auto object-contain'
            />

            {file && (
              <div className='absolute inset-0 z-10 flex items-center justify-center'>
                <div
                  className={clsx(
                    // 'flex h-1/5 w-2/5  translate-y-[10%] flex-col gap-1 relative',
                    'relative flex aspect-[566/300] w-2/5 translate-y-[10%] flex-col justify-center gap-1',
                  )}
                >
                  {file && (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt='Uploaded File'
                      layout='fill'
                      className='mx-auto h-full object-contain'
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {error && <p className='ml-1 text-center text-xs text-red-500'>{error}</p>}

        {/* Buttons */}
        <div className='flex w-full flex-shrink-0 flex-col items-center justify-center gap-3 md:flex-row'>
          <div className='w-full max-w-[352px]'>
            <Controller
              name='file'
              control={control}
              rules={{ required: 'File is required' }}
              render={({ field: { onChange, name } }) => (
                <Input
                  type='file'
                  accept='image/*'
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
                      className='flex h-13 items-center justify-center text-sm'
                      onClick={trigger}
                      animation='fadeUp'
                      iconAnimation={<UploadSimpleIcon />}
                    >
                      <span>UPLOAD FILES</span>
                    </Button>
                  )}
                />
              )}
            />
          </div>
          <Button
            type='submit'
            variant='brown'
            fullWidth
            className='h-13 max-w-[352px] text-sm'
            animation='fadeUp'
            iconAnimation={<ChevronRight height={20} />}
            disabled={!Boolean(file)}
          >
            PROCEED TO CHECKOUT
          </Button>
        </div>
      </Container>
    </div>
  );
}
