'use client';
import { Button } from '@/src/components/ui/Button';
import { RulerIcon } from '@/src/components/ui/Icons';
import clsx from 'clsx';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ProductFormSchema, ProductFormValues } from '../lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import React, { useEffect, useMemo, useState } from 'react';
import DialogCustom from './Dialog';
import { SIZE_CHART } from '../lib/data';
import { getColorClass, getOptionKeyById } from '../lib/helper';
import { useProductStore } from '@/src/store/productStore';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '../service/get.product';
import { useSelectedColor } from '@/src/store/selectedColorStore';
import { useAuthStore } from '@/src/store/authStore';
import { useAppyDraft } from '../hooks/useApplyDraft';
import { LoaderCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import UploadButton from './UploadButton';

type OptionType = 'CustomizableDropDownOption' | 'CustomizableFieldOption';

type ValueItem = {
  key: string;
  label: string;
};

type Option = {
  id: number | string;
  title: string;
  values?: ValueItem[];
  type: OptionType;
};

const MEASUREMENT_LABELS = [
  { key: 'frontLength', label: 'Front length from HSP' },
  { key: 'chestWidth', label: '1/2 chest width' },
  { key: 'waistWidth', label: '1/2 waist width /waistband width' },
  { key: 'hemWidth', label: '1/2 hem width' },
  { key: 'sleeveLength', label: 'Sleeve length from shoulder (set in)' },
  { key: 'hoodHeight', label: 'Hood height' },
];

export default function Form({ product }: { product: Product | null }) {
  /** Get data from zustand */
  const { formStore, setFormStore } = useProductStore();
  const setSelectedColor = useSelectedColor((state) => state.setSelectedColor);
  const user = useAuthStore((state) => state.user);
  const { applyDraftOrder, isLoading: getDraftLoading } = useAppyDraft();
  const { store } = useParams();

  /** Handle Options */
  const {
    OPTIONS,
    colorMapImageByLabel,
    colorMapById,
    sizeMapById,
    logoColorMapById,
  }: {
    OPTIONS: Option[];
    colorMapImageByLabel: Map<string, string>;
    colorMapById: Map<string, string>;
    sizeMapById: Map<string, string>;
    logoColorMapById: Map<string, string>;
  } = useMemo(() => {
    const options =
      product?.options
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map((option) => {
          return {
            id: option.option_id,
            title: option.title,
            values:
              option.value?.map((v) => ({
                key: v.option_type_id.toString(),
                label: v.title?.toUpperCase() || '',
              })) || [],
            type: option.__typename as OptionType,
          };
        }) || [];

    const colorMapImageByLabel = new Map();
    product?.media_gallery?.forEach((media) => {
      colorMapImageByLabel.set(media?.label?.toUpperCase(), media.url);
    });

    // Color
    const colorMapById = new Map();
    product?.options
      ?.find((opt) => opt.title.toLowerCase().startsWith('color'))
      ?.value?.forEach((val) => {
        colorMapById.set(val.option_type_id.toString(), val.title?.toUpperCase() || '');
      });

    // Size
    const sizeMapById = new Map();
    product?.options
      ?.find((opt) => opt.title.toLowerCase().startsWith('size'))
      ?.value?.forEach((val) => {
        sizeMapById.set(val.option_type_id.toString(), val.title?.toUpperCase() || '');
      });

    // Logo Color
    const logoColorMapById = new Map();
    product?.options
      ?.find((opt) => opt.title.toLowerCase().endsWith(' color'))
      ?.value?.forEach((val) => {
        logoColorMapById.set(val.option_type_id.toString(), val.title?.toUpperCase() || '');
      });

    return {
      OPTIONS: options,
      colorMapImageByLabel,
      colorMapById,
      sizeMapById,
      logoColorMapById,
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
    const colorOption = OPTIONS?.find((opt) => opt.title.toLowerCase().includes('color'));
    const sizeOption = OPTIONS?.find((opt) => opt.title.toLowerCase().includes('size'));
    const logoColorOption = OPTIONS?.find((opt) => opt.title.toLowerCase().endsWith(' color'));

    const initColor = colorOption?.values?.[0];
    const initSize = sizeOption?.values?.[0];
    const initImage = initColor?.label ? colorMapImageByLabel.get(initColor.label) : '';
    const initLogoColor = logoColorOption?.values?.[1] || { key: '', label: '' };

    const fileInStore = formStore?.file;
    if (fileInStore) {
      fileInStore.isUpdate = true;
    }

    reset(
      formStore
        ? {
            ...formStore,
            file: fileInStore as unknown as File,
          }
        : {
            selectedImage: initImage || '',
            size: initSize || { key: '', label: '' },
            color: initColor || { key: '', label: '' },
            logoColor: initLogoColor || { key: '', label: '' },
            file: null as unknown as File,
          },
    );
  }, [reset, OPTIONS, colorMapImageByLabel, formStore]);

  const [selectedSize, selectedColor, selectedLogoColor, selectedFile] = useWatch({
    control,
    name: ['size', 'color', 'logoColor', 'file'],
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const router = useRouter();

  /** Sync selected image - selected color */
  useEffect(() => {
    if (selectedColor?.label) {
      const newImage = colorMapImageByLabel.get(selectedColor.label) || '';
      setValue('selectedImage', newImage);
      setSelectedColor(selectedColor.label.toUpperCase());
    }
  }, [selectedColor, setValue, colorMapImageByLabel, setSelectedColor]);

  /** Handle submit */
  const onSubmit = (data: ProductFormValues) => {
    setFormStore({ ...data, product_id: product?.id || 0 });
    router.push(`/${store}/checkout`);
  };

  /** Handle apply draft order */
  const handleApplyDraftOrder = () => {
    applyDraftOrder({
      orderId: user?.personalize_draff || 0,
      colorMapById,
      sizeMapById,
      logoColorMapById,
    });
  };

  /** Render options */
  const renderOptions = (option: Option) => {
    switch (option.type) {
      case 'CustomizableFieldOption':
        return (
          <div className='flex w-full flex-col gap-3'>
            <h4 className='font-ccep-wide text-sm font-medium lg:text-xl'>{option?.title}</h4>
            <p className='text-sm font-light'>
              We&apos;re excited to help you create a hoodie that represents your brand! For the
              best print quality, upload a high-resolution logo file (PNG, SVG, or JPG). Make sure
              it&apos;s clear, high contrast, and free of watermarks.
            </p>

            <UploadButton selectedFile={selectedFile} setOpenDialog={setOpenDialog} />
            {errors?.file && <p className='ml-1 text-xs text-red-500'>{errors.file.message}</p>}
          </div>
        );

      case 'CustomizableDropDownOption':
        const id = option.id;
        const optionKey = getOptionKeyById(id);
        if (optionKey === 'size') {
          return (
            <div className='font-ccep-wide flex flex-col gap-3'>
              <div className='flex w-full items-center justify-between text-sm'>
                <div className='flex items-center gap-3 lg:gap-4'>
                  <span className='font-medium lg:text-xl'>{option.title}</span>
                  <span className='font-light'>{selectedSize?.label || ''}</span>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <div className='text-red flex cursor-pointer items-center gap-3'>
                      <span className='font-medium underline'>Size chart</span>
                      <RulerIcon fill='var(--color-red)' />
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    className='w-[350px] rounded-2xl p-4 shadow-lg md:w-100'
                    side='bottom'
                    align='end'
                  >
                    <div className='overflow-x-auto'>
                      <table className='w-full border-collapse text-xs'>
                        <thead>
                          <tr className='border-b'>
                            <th className='px-1 py-2 text-left font-medium'>Measurements</th>
                            {SIZE_CHART.map((sizeData) => (
                              <th key={sizeData.size} className='px-1 py-2 text-center font-medium'>
                                {sizeData.size}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {MEASUREMENT_LABELS.map((measurement, idx) => (
                            <tr
                              key={measurement.key}
                              className={idx === MEASUREMENT_LABELS.length - 1 ? '' : 'border-b'}
                            >
                              <td className='px-1 py-1.5 text-left'>{measurement.label}</td>
                              {SIZE_CHART.map((sizeData) => (
                                <td key={sizeData.size} className='px-1 py-1.5 text-center'>
                                  {sizeData[measurement.key as keyof typeof sizeData]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                            field.value?.key === size.key && '!border-brown bg-white',
                          )}
                          onClick={() => field.onChange(size)}
                        >
                          {size.label}
                        </button>
                      ))}
                  </div>
                )}
              />
            </div>
          );
        }
        if (optionKey === 'color') {
          return (
            <div className='font-ccep-wide flex flex-col gap-3'>
              <div className='flex w-full items-center justify-between text-sm'>
                <span className='font-medium lg:text-xl'>{option.title}</span>
              </div>

              <Controller
                name='color'
                control={control}
                render={({ field }) => (
                  <TooltipProvider>
                    <div className='flex flex-wrap items-center gap-3'>
                      {option?.values &&
                        option.values.map((color, index) => {
                          const isSameBlackColor =
                            selectedLogoColor?.label === 'BLACK' && color?.label === 'BLACK';

                          return (
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <button
                                  type='button'
                                  className={clsx(
                                    'relative grid aspect-square h-[35px] cursor-pointer place-items-center rounded-[40px] border-2 p-0.5 text-sm transition duration-300',
                                    field.value?.key === color.key && '!border-brown',
                                    isSameBlackColor && '!cursor-not-allowed opacity-20',
                                  )}
                                  disabled={isSameBlackColor}
                                  onClick={() => {
                                    if (isSameBlackColor) return;
                                    field.onChange(color);
                                    setSelectedColor(color.label.toUpperCase());
                                  }}
                                >
                                  <div
                                    className={clsx(
                                      'h-full w-full rounded-full',
                                      getColorClass(color.label),
                                    )}
                                  />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{color.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                    </div>
                  </TooltipProvider>
                )}
              />
            </div>
          );
        }
        if (optionKey === 'logo_color') {
          return (
            <div className='font-ccep-wide flex flex-col gap-3'>
              <div className='flex w-full items-center justify-between text-sm'>
                <span className='font-medium lg:text-xl'>{option.title}</span>
              </div>

              <Controller
                name='logoColor'
                control={control}
                render={({ field }) => (
                  <TooltipProvider>
                    <div className='flex flex-wrap items-center gap-3'>
                      {option?.values &&
                        option.values.map((color, index) => {
                          const isSameBlackColor =
                            selectedColor?.label === 'BLACK' && color?.label === 'BLACK';

                          return (
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <button
                                  type='button'
                                  className={clsx(
                                    'relative grid aspect-square h-[35px] cursor-pointer place-items-center rounded-[40px] border-2 p-0.5 text-sm transition duration-300',
                                    field.value?.key === color.key && '!border-brown',
                                    isSameBlackColor && '!cursor-not-allowed opacity-20',
                                  )}
                                  disabled={isSameBlackColor}
                                  onClick={() => {
                                    if (isSameBlackColor) return;
                                    field.onChange(color);
                                  }}
                                >
                                  <div
                                    className={clsx(
                                      'h-full w-full rounded-full',
                                      getColorClass(color.label),
                                    )}
                                  />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{color.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                    </div>
                  </TooltipProvider>
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
    <>
      {getDraftLoading && (
        <div className='fixed inset-0 z-9999 grid place-items-center bg-black/20'>
          <LoaderCircle className='text-red h-10 w-10 animate-spin' />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-2.5 lg:gap-5'>
        <Button
          type='button'
          variant='white'
          disabled={!Boolean(user?.personalize_draff)}
          className='w-max !py-2 !text-sm hover:bg-gray-300'
          onClick={handleApplyDraftOrder}
        >
          Apply Draft
        </Button>

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
          color={watch('logoColor')?.label}
          setValue={setValue}
        />
      </form>
    </>
  );
}
