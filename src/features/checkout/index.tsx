'use client';
import { Button } from '@/src/components/ui/Button';
import Container from '@/src/components/ui/Container';
import { useProductStore } from '@/src/store/productStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, FileAxis3D, LoaderCircle, Pen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { CheckoutFormValues, checkoutSchema } from './lib/schema';
import { useEffect, useMemo, useState } from 'react';
import Input from '@/src/components/ui/Input';
import Checkbox from '@/src/components/ui/Checkbox';
import { getColorClass } from '../product/lib/helper';
import clsx from 'clsx';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useCheckout } from './hooks/useCheckout';
import { useAuthStore } from '@/src/store/authStore';
import { toast } from 'react-toastify';
import { Alert, AlertDescription } from '@/src/components/ui/alert';

export default function CheckoutView() {
  const router = useRouter();
  const { formStore: productStore } = useProductStore();
  const { formStore: checkoutStore, setFormStore: setCheckoutStore } = useCheckoutStore();
  const [angreement, setAgreement] = useState<boolean>(false);
  const { isLoading, submit } = useCheckout();
  const pinCode = useAuthStore((state) => state.pinCode);
  const user = useAuthStore((state) => state.user);
  const orderCount = useMemo(() => {
    return user?.personalize_items && typeof user.personalize_items === 'string'
      ? user.personalize_items
          ?.split(',')
          .filter((item) => item && +item.trim() != user?.personalize_draff).length
      : 0;
  }, [user]);

  /** Use form */
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    setError,
    reset,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutStore || {
      email: user?.email || '',
      phone: '',
      restaurantName: user?.name || '',
      street: '',
      street2: '',
      district: '',
      postcode: undefined,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: true,
    shouldUnregister: true,
  });

  /** Sync form */
  useEffect(() => {
    if (user) {
      if (!checkoutStore) {
        setValue('email', user.email || '');
        setValue('restaurantName', user.name || '');
        setValue('street', user?.address?.street || '');
        setValue('district', user?.address?.city || '');
        if (user?.address?.postcode) setValue('postcode', user?.address?.postcode);
      } else {
        reset(checkoutStore);
      }
    }
  }, [user, setValue, checkoutStore, reset]);

  /** Handle store data */
  const onStoreData = () => {
    setCheckoutStore(watch());
  };

  /** Handle back */
  const onBack = () => {
    onStoreData();
    router.push('/design-product');
  };

  /** Handle submit form */
  const onSubmit = (data: CheckoutFormValues) => {
    if (!pinCode) {
      toast.error('Employee ID is missing!');
      router.push('/');
      return;
    }

    submit({ data, pinCode, status: 1 });
  };

  /** Handle draft */
  const onDraft = (data: CheckoutFormValues) => {
    if (!pinCode) {
      toast.error('Employee ID is missing!');
      router.push('/');
      return;
    }

    submit({ data, pinCode, status: 5 }, onStoreData);
  };

  return (
    <Container className='py-2.5 sm:py-5 md:py-7.5 lg:py-10'>
      <Container className='flex w-full flex-col rounded-[28px] bg-white py-2.5 sm:py-5 md:py-7.5 lg:py-10'>
        {/* Head */}
        <div className='flex w-full items-center justify-between'>
          <Button
            variant='white'
            className='h-12 w-12 flex-shrink-0 rounded-full border-3 !p-0'
            onClick={onBack}
          >
            <ArrowLeft />
          </Button>

          <Link href='/' className='flex items-center rounded-full pl-2'>
            <Image
              src='/images/coca_cola_logo_red.svg'
              width={233}
              height={42}
              alt='Coca Cola Logo'
              className='h-9 w-auto lg:h-10.5'
              priority
            />
          </Link>
        </div>

        <div className='mt-5'>
          {orderCount >= 2 && (
            <Alert className='border-amber-200 bg-amber-50'>
              <AlertDescription className='text-red'>
                <strong>Order Limit Reached:</strong> You have already ordered {orderCount} hoodies.
                Each customer can order a maximum of 2 hoodies.
              </AlertDescription>
            </Alert>
          )}

          {orderCount === 1 && (
            <Alert className='border-blue-200 bg-blue-50'>
              <AlertDescription className='text-blue-800'>
                <strong>Notice:</strong> You have ordered 1 hoodie. You can order 1 more hoodie
                (maximum 2 per customer).
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='3xl:gap-x-20 mt-7.5 grid w-full gap-y-5 md:mt-10 md:grid-cols-2 md:gap-x-5 lg:mt-12.5 lg:gap-x-10'
        >
          {/* Infor */}
          <div className='flex w-full flex-col gap-5 md:gap-7.5 lg:gap-10'>
            <h1 className='text-[28px] lg:text-[32px]'>Checkout</h1>

            {/* Contact infor */}
            <div className='flex w-full flex-col gap-5'>
              <h2 className='text-xl'>Contact Information</h2>
              <div className='grid w-full grid-cols-1 gap-y-3'>
                <Input
                  label='E-mail address'
                  required
                  placeholder='Enter restaurant email'
                  className='border-2 font-light'
                  error={errors.email?.message}
                  {...register('email', { required: true })}
                  disabled={true}
                />
                <Input
                  label='Phone number'
                  required
                  placeholder='+1 212 555 1234'
                  {...register('phone')}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/[^+\d]/g, '');

                    if (value.startsWith('+')) {
                      value = '+' + value.slice(1).replace(/\D/g, '');
                    } else {
                      value = value.replace(/\D/g, '');
                    }

                    value = value.slice(0, 21);
                    setValue('phone', value);
                    setError('phone', { message: '', type: 'manual' });
                  }}
                  className='border-2 font-light'
                  error={errors.phone?.message}
                />
                <Input
                  label='Restaurant name'
                  required
                  placeholder='Enter name of your restaurant'
                  className='border-2 font-light'
                  error={errors.restaurantName?.message}
                  {...register('restaurantName', { required: true })}
                />
              </div>
            </div>

            {/* Delivery */}
            <div className='flex w-full flex-col gap-5'>
              <h2 className='text-xl'>Delivery Address</h2>
              <div className='grid w-full grid-cols-1 gap-y-3'>
                <Input
                  label='Street & Number'
                  required
                  placeholder='e.g. Main Street 123'
                  {...register('street')}
                  className='border-2 font-light'
                  error={errors.street?.message}
                />
                <Input
                  label='Building / Entrance / Floor'
                  placeholder='e.g. Entrance B, 3rd Floor'
                  {...register('street2')}
                  className='border-2 font-light'
                  error={errors.street2?.message}
                />
                <Input
                  label='District / Area'
                  required
                  placeholder='e.g. City Center'
                  {...register('district')}
                  className='border-2 font-light'
                  error={errors.district?.message}
                />
                <Input
                  label='Postcode'
                  required
                  placeholder='123456'
                  {...register('postcode')}
                  className='border-2 font-light'
                  error={errors.postcode?.message}
                />
              </div>
            </div>
          </div>

          {/* Order */}
          <div className='flex w-full flex-col gap-7.5'>
            <h2 className='text-xl'>Order Summary</h2>

            <div className='flex w-full flex-col gap-3'>
              {/* Card */}
              {productStore?.file && (
                <div className='font-ccep-wide flex gap-4 rounded-[20px] border-2 border-[#D9D9D9] p-4'>
                  <Image
                    src={productStore?.selectedImage}
                    width={120}
                    height={120}
                    alt='Product Image'
                    className='h-30 w-30 shrink-0 object-contain'
                  />

                  <div className='grid grid-cols-[max-content_1fr] gap-3'>
                    <p className='col-span-full text-sm font-normal lg:text-xl'>
                      Coca-Cola Classic Hoodie
                    </p>

                    <div className='mt-2 flex items-center gap-1.5'>
                      <div className='bg-gray grid aspect-square w-9 shrink-0 place-items-center rounded-full text-sm'>
                        {productStore?.size?.label || 'L'}
                      </div>
                      {productStore?.color && (
                        <div
                          className={clsx(
                            'grid aspect-square h-9 shrink-0 place-items-center rounded-full border-2',
                            getColorClass(productStore?.color?.label),
                          )}
                        />
                      )}
                    </div>

                    <div className='row-span-2'>
                      <Image
                        // src={URL.createObjectURL(productStore?.file)}
                        src={
                          typeof productStore?.file === 'string'
                            ? productStore?.file
                            : URL.createObjectURL(productStore?.file)
                        }
                        width={80}
                        height={80}
                        alt='Design Image'
                        className='h-20 w-20 border object-contain p-1'
                      />
                    </div>

                    <button
                      type='button'
                      className='hover:bg-gray flex w-max cursor-pointer items-center gap-1.5 rounded-[20px] border border-[#D9D9D9] bg-white px-3 py-2 text-sm font-normal transition-colors duration-300'
                      onClick={onBack}
                    >
                      Edit <Pen size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Checkbox
              label={
                <div className='text-sm'>
                  <span>I agree to the</span>{' '}
                  <Link href='/terms' className='text-red hover:underline' onClick={onStoreData}>
                    Terms & Conditions
                  </Link>
                </div>
              }
              onChange={(e) => setAgreement(e.target.checked)}
              checked={angreement}
            />

            <Button
              type='submit'
              variant='brown'
              animation='scaleIn'
              fullWidth
              disabled={!angreement || isLoading || orderCount >= 2}
            >
              {isLoading ? <LoaderCircle className='mx-auto h-7 animate-spin' /> : 'CONFIRM ORDER'}
            </Button>

            <Button
              type='button'
              variant='white'
              animation='scaleIn'
              fullWidth
              disabled={!angreement || isLoading || orderCount >= 2}
              onClick={handleSubmit(onDraft)}
              iconAnimation={<FileAxis3D />}
            >
              {isLoading ? <LoaderCircle className='mx-auto h-7 animate-spin' /> : 'DRAFT ORDER'}
            </Button>
          </div>
        </form>
      </Container>
    </Container>
  );
}
