'use client';

import { useEffect, useRef, useState } from 'react';
import Container from '@/src/components/ui/Container';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { ProductFormValues } from '../lib/schema';
import { FieldValues } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { ArrowLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import clsx from 'clsx';
import { UploadSimpleIcon } from '@/src/components/ui/Icons';
import gsap from 'gsap';
import NextImage from 'next/image';
import Input from '@/src/components/ui/Input';
import { useImageWorker } from '../hooks/useImageWorker';
import { CustomFile } from '../hooks/useApplyDraft';

type DialogProps<T extends FieldValues = ProductFormValues> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  control: Control<T>;
  error: string | undefined;
  imageUrl: string;
  color: string; // 'black' | 'white'
  file: CustomFile | null
  setValue: UseFormSetValue<ProductFormValues>
};

export default function DialogCustom({
  control,
  open,
  setOpen,
  error,
  imageUrl,
  color,
  file,
  setValue
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<CustomFile | null>(null);

  useEffect(() => {
    if (file?.isUpdate) {
      let tmpFile = file;
      tmpFile.isUpdate = false;
      setProcessedImageUrl(URL.createObjectURL(tmpFile));
      setSelectedFile(tmpFile);
    }
  }, [file?.isUpdate, setProcessedImageUrl, setSelectedFile])

  // Use the Web Worker hook
  const { processImage, isProcessing } = useImageWorker();

  // Handle file change with Web Worker
  useEffect(() => {
    if (!color || !open) return; // only process when have color, file and dialog is open

    if (!selectedFile) return;

    const process = async () => {
      const result = await processImage(selectedFile, color);
      setProcessedImageUrl(result?.blobUrl || null);
      if (result) {
        const file = result.processedFile;
        (file as CustomFile).isUpdate = false;
        setValue('file', file);
      } else {
        setSelectedFile(null);
        setValue('file', null as unknown as File);
      }
    };

    process()
  }, [color, processImage, open, selectedFile, setSelectedFile, setProcessedImageUrl]);

  /** Animation when open */
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.style.display = open ? 'block' : 'none';
    }

    if (open && dialogRef.current) {
      gsap.fromTo(
        dialogRef.current,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.2,
          ease: 'power2.out',
        },
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
            <NextImage
              src={imageUrl}
              width={500}
              height={500}
              alt='Product Image'
              className='h-full w-auto object-contain'
            />

            {selectedFile || file ? (
              <div className='absolute inset-0 z-10 flex items-center justify-center'>
                <div
                  className={clsx(
                    'relative flex aspect-square w-2/5 -translate-y-[30%] flex-col justify-center gap-1',
                  )}
                >
                  {isProcessing ? (
                    <div className='fixed inset-0 z-9999 grid place-items-center'>
                      <LoaderCircle className='text-red h-10 w-10 animate-spin' />
                    </div>
                  ) : processedImageUrl ?
                    (
                      <div className='grid grid-rows-3 gap-2 w-full h-full'>
                        {/* Show processed image if available, otherwise show original image */}
                        <NextImage
                          src={processedImageUrl || ''}
                          alt='Uploaded File'
                          width={100}
                          height={100}
                          className='mx-auto h-full w-full object-contain'
                        />
                        {color ? (
                          <div className='relative row-span-2 w-full'>
                            {color.toLowerCase() === 'black' ? (
                              <NextImage
                                src='/images/product-page/hoodie_front_black.png'
                                alt='Uploaded File'
                                layout='fill'
                                className='mx-auto h-full object-contain'
                              />
                            ) : (
                              <NextImage
                                src='/images/product-page/hoodie_front_white.png'
                                alt='Uploaded File'
                                layout='fill'
                                className='mx-auto h-full object-contain'
                              />
                            )}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                </div>
              </div>
            ) : null}
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
              render={({ field: { name } }) => (
                <Input
                  type='file'
                  // accept='.jpg,.jpeg,.png,.tiff,.tif,.webp,.svg'
                  accept=".png,.jpg,.jpeg,.bmp,.tiff,.svg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // onChange(e.target.files[0]);
                      setSelectedFile(e.target.files[0]);
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
                      disabled={isProcessing}
                    >
                      <span>{isProcessing ? 'PROCESSING...' : 'UPLOAD FILES'}</span>
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
            disabled={!Boolean(file || selectedFile) || isProcessing}
          >
            PROCEED TO CHECKOUT
          </Button>
        </div>
      </Container>
    </div>
  );
}