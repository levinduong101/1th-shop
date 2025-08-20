'use client';
import { Button } from '@/src/components/ui/Button';
import { RulerIcon, UploadSimpleIcon } from '@/src/components/ui/Icons';
import Input from '@/src/components/ui/Input';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import { ProductFormSchema, ProductFormValues } from '../validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { useState } from 'react';
import DialogCustom from './Dialog';

const SIZE = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

export const SIZE_CHART = [
  { eu: 'S', chest: '92–96 cm', waist: '76–80 cm' },
  { eu: 'M', chest: '96–100 cm', waist: '80–84 cm' },
  { eu: 'L', chest: '100–104 cm', waist: '84–88 cm' },
  { eu: 'XL', chest: '104–108 cm', waist: '88–92 cm' },
  { eu: '2XL', chest: '108–112 cm', waist: '92–96 cm' },
  { eu: '3XL', chest: '112–116 cm', waist: '96–100 cm' },
];

export default function Form() {
  const {
    control,
    watch,
    handleSubmit,
    register,
    formState: { errors },
    trigger,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      size: SIZE[0],
      name: '',
      file: null as unknown as File,
    },
  });

  const selectedSize = watch('size');
  const [showProductPopup, setShowProductPopup] = useState<
    (ProductFormValues & { isImage?: boolean }) | null
  >(null);

  /** Handle submit */
  const onSubmit = (data: ProductFormValues) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  /** Handle show text preview */
  const handleShowTextPreview = async () => {
    const isValid = await trigger('name');
    if (isValid) {
      setShowProductPopup(watch());
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-4.5 lg:gap-7.5'>
        {/* Size */}
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
                side='top'
                align='end'
              >
                <h3 className='mb-2 font-semibold'>European Size Chart</h3>
                <table className='w-full border-collapse text-sm'>
                  <thead>
                    <tr className='border-b'>
                      <th className='py-1 text-left'>EU</th>
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
                {SIZE.map((size, index) => (
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

        <div className='h-[1px] w-full bg-[#F1F2F3]' />

        {/* Name */}
        <div className='flex w-full flex-col gap-3'>
          <h4 className='font-ccep-wide text-sm font-medium lg:text-xl'>
            Personalize your hoodie with a name or phrase.
          </h4>
          <p className='text-sm font-light'>
            Please be aware that the preview might not fully reflect the final produced version.
            While the preview aims to provide a close approximation, there may be variations in
            aspects such as color, layout, or detail in the final product.
          </p>
          <div className='flex w-full flex-col gap-1.5 md:gap-2.5'>
            <Input
              className='!border-brown focus:!border-red h-11 border-2'
              placeholder='Personalize up to 18 characters'
              {...register('name', { required: true, max: 18 })}
              error={errors?.name?.message}
              buttonEnd={
                <Button
                  type='button'
                  variant='brown'
                  className='!hidden h-11 lg:!flex lg:!text-sm'
                  onClick={handleShowTextPreview}
                >
                  PREVIEW
                </Button>
              }
            />
            <Button
              type='button'
              variant='brown'
              fullWidth
              className='h-11 text-sm lg:hidden'
              onClick={handleShowTextPreview}
            >
              PREVIEW
            </Button>
          </div>
        </div>

        {/* Photo */}
        <div className='flex w-full flex-col gap-3'>
          <h4 className='font-ccep-wide text-sm font-medium lg:text-xl'>
            Add Your Restaurant Logo
          </h4>
          <p className='text-sm font-light'>
            We’re excited to help you create a hoodie that represents your brand! For the best print
            quality, upload a high-resolution logo file (PNG, SVG, or JPG). Make sure it’s clear,
            high contrast, and free of watermarks.
          </p>

          <Button
            type='button'
            variant='white'
            fullWidth
            className='h-11 text-sm lg:h-13'
            onClick={() => setShowProductPopup({ ...watch(), isImage: true })}
          >
            <span>PLACE LOGO</span>
            <UploadSimpleIcon />
          </Button>
        </div>

        <div className='h-[1px] w-full bg-[#F1F2F3]' />

        <Button type='submit' variant='red' fullWidth className='h-11 lg:h-13'>
          CONTINUE
        </Button>
      </form>

      <DialogCustom
        showProductPopup={showProductPopup}
        setShowProductPopup={setShowProductPopup}
        control={control}
        register={register}
        file={watch('file')}
      />
    </>
  );
}

/* <Controller
    name="file"
    control={control}
    rules={{ required: "File is required" }}
    render={({ field: { onChange, value, name } }) => (
        <UploadField
            onlyButton
            buttonVariant='white'
            buttonClassName='h-11 lg:h-13 text-sm gap-1 md:!w-full'
            buttonContent={
                <>
                    <span>PLACE LOGO</span>
                    <UploadSimpleIcon />
                </>
            }
            accept='image'
            name={name}
            onChange={(e) => {
                onChange(e.target.files?.[0]);
            }}
            error={errors?.file?.message}
        />
    )}
/> */
