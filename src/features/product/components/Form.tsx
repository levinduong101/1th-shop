'use client';
import { Button } from '@/src/components/ui/Button';
import { RulerIcon, UploadIcon, UploadSimpleIcon } from '@/src/components/ui/Icons';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import { ProductFormSchema, ProductFormValues } from '../lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import React, { useEffect, useMemo, useState } from 'react';
import DialogCustom from './Dialog';
import { SIZE_CHART } from '../lib/data';
import { getColorClass } from '../lib/helper';
import Image from 'next/image';
import { useProductStore } from '@/src/store/productStore';
import { useRouter } from 'next/navigation';
import { Product } from '../service/get.product';

type OptionType = 'CustomizableDropDownOption' | 'CustomizableFieldOption';

type Option = {
  title: string;
  values?: string[];
  type: OptionType;
};

export default function Form({ product }: { product: Product | null }) {
  /** Get data from zustand */
  const { formStore, setFormStore } = useProductStore();

  /** Handle Options */
  const { OPTIONS, colorMapImage }: { OPTIONS: Option[]; colorMapImage: Map<string, string> } =
    useMemo(() => {
      const options =
        product?.options
          ?.sort((a, b) => a.sort_order - b.sort_order)
          .map((option) => {
            return {
              title: option.title,
              values: option.value?.map((v) => v.title?.toUpperCase()) || [],
              type: option.__typename as OptionType,
            };
          }) || [];

      const colorMapImage = new Map();

      product?.media_gallery?.forEach((media) => {
        colorMapImage.set(media?.label?.toUpperCase(), media.url);
      });

      return {
        OPTIONS: options,
        colorMapImage,
      };
    }, [product]);

  /** Init form-hook */
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
  });

  /** Set default values */
  useEffect(() => {
    const initColor =
      OPTIONS?.find((opt) => opt.title.toLowerCase().includes('color'))?.values?.[0] || '';
    const initImage = initColor ? colorMapImage.get(initColor) : '';

    reset(
      formStore || {
        selectedImage: initImage || '',
        size: OPTIONS?.find((opt) => opt.title.toLowerCase().includes('size'))?.values?.[0] || '',
        color: initColor,
        file: null as unknown as File,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, OPTIONS, colorMapImage]);

  const selectedSize = watch('size');
  const selectedFile = watch('file');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const router = useRouter();

  /** Handle submit */
  const onSubmit = (data: ProductFormValues) => {
    setFormStore(data);
    router.push('/checkout');
  };

  /** Render options */
  const renderOptions = (option: Option) => {
    switch (option.type) {
      case 'CustomizableFieldOption':
        return (
          <div className='flex w-full flex-col gap-3'>
            <h4 className='font-ccep-wide text-sm font-medium lg:text-xl'>{option?.title}</h4>
            <p className='text-sm font-light'>
              We’re excited to help you create a hoodie that represents your brand! For the best
              print quality, upload a high-resolution logo file (PNG, SVG, or JPG). Make sure it’s
              clear, high contrast, and free of watermarks.
            </p>

            <Button
              type='button'
              variant='white'
              fullWidth
              className={clsx(
                '!p-0 text-sm transition-none lg:h-13',
                selectedFile
                  ? 'relative !h-100 overflow-hidden !rounded-2xl border-2 border-dashed p-6'
                  : 'h-11',
              )}
              onClick={() => setOpenDialog(true)}
              iconAnimation={<UploadSimpleIcon />}
              animation={selectedFile ? undefined : 'fadeUp'}
            >
              {selectedFile ? (
                <>
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt='preview'
                    className='absolute inset-0 h-full w-full object-contain p-5'
                    width={500}
                    height={300}
                  />

                  {/* Overlay with blur + upload icon */}
                  <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                    <UploadIcon fill='black' bgFill='white' />
                  </div>
                </>
              ) : (
                <span>PLACE LOGO</span>
              )}
            </Button>

            {errors?.file && <p className='ml-1 text-xs text-red-500'>{errors.file.message}</p>}
          </div>
        );

      case 'CustomizableDropDownOption':
        const title = option.title.toLowerCase();
        if (title.includes('size')) {
          return (
            <div className='font-ccep-wide flex flex-col gap-3'>
              <div className='flex w-full items-center justify-between text-sm'>
                <div className='flex items-center gap-3 lg:gap-4'>
                  <span className='font-medium lg:text-xl'>Size</span>
                  <span className='font-light'>{selectedSize}</span>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <div className='text-red flex cursor-pointer items-center gap-3'>
                      <span className='font-medium underline'>Size chart</span>
                      <RulerIcon fill='var(--color-red)' />
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    className='w-[300px] rounded-2xl p-4 shadow-lg'
                    side='bottom'
                    align='end'
                  >
                    <table className='w-full border-collapse text-sm'>
                      <thead>
                        <tr className='border-b'>
                          <th className='py-1 text-left'>Size</th>
                          <th className='py-1 text-left'>Chest</th>
                          <th className='py-1 text-left'>Waist</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SIZE_CHART.map((row, idx) => (
                          <tr key={idx} className='border-b last:border-0'>
                            <td className='py-1'>{row.eu}</td>
                            <td className='py-1'>{row.chest}</td>
                            <td className='py-1'>{row.waist}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </PopoverContent>
                </Popover>
              </div>

              <Controller
                name='size'
                control={control}
                render={({ field }) => (
                  <div className='flex flex-wrap items-center gap-3'>
                    {option?.values &&
                      option.values.map((size, index) => (
                        <button
                          key={index}
                          type='button'
                          className={clsx(
                            'border-gray bg-gray grid h-[35px] cursor-pointer place-items-center rounded-[40px] border-2 px-4 text-sm transition-colors duration-300 hover:bg-white',
                            field.value === size && '!border-brown bg-white',
                          )}
                          onClick={() => field.onChange(size)}
                        >
                          {size}
                        </button>
                      ))}
                  </div>
                )}
              />
            </div>
          );
        }
        if (title.includes('color')) {
          return (
            <div className='font-ccep-wide flex flex-col gap-3'>
              <div className='flex w-full items-center justify-between text-sm'>
                <span className='font-medium lg:text-xl'>Color</span>
              </div>

              <Controller
                name='color'
                control={control}
                render={({ field }) => (
                  <div className='flex flex-wrap items-center gap-3'>
                    {option?.values &&
                      option.values.map((color, index) => (
                        <button
                          key={index}
                          type='button'
                          className={clsx(
                            'grid h-[35px] cursor-pointer place-items-center rounded-[40px] border-2 border-current px-4 text-sm transition-colors duration-300',
                            field.value === color && '!border-brown',
                            getColorClass(color),
                          )}
                          onClick={() => {
                            field.onChange(color);
                            const newImage = colorMapImage.get(color) || '';
                            setValue('selectedImage', newImage);
                          }}
                        />
                      ))}
                  </div>
                )}
              />
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-4.5 lg:gap-7.5'>
      {OPTIONS?.map((option, index) => (
        <React.Fragment key={index}>
          {renderOptions(option)}
          <div className='h-[1px] w-full bg-[#F1F2F3]' />
        </React.Fragment>
      ))}

      <div className='h-[1px] w-full bg-[#F1F2F3]' />

      <Button
        type='button'
        variant='red'
        fullWidth
        className='h-11 lg:h-13'
        animation='scaleIn'
        disabled={!selectedFile}
        onClick={() => setOpenDialog(true)}
      >
        CONTINUE
      </Button>

      <DialogCustom
        imageUrl={watch('selectedImage') || '/images/product-page/product.png'}
        open={openDialog}
        setOpen={setOpenDialog}
        control={control}
        file={selectedFile}
        error={errors.file?.message}
      />
    </form>
  );
}
