'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/src/components/ui/Button';
import Checkbox from '@/src/components/ui/Checkbox';
import Input from '@/src/components/ui/Input';
import Textarea from '@/src/components/ui/TextArea';
import UploadField from '@/src/components/ui/UploadField';
import Image from 'next/image';
import AnimatedText from '@/src/components/ui/AnimatedText';
import Container from '@/src/components/ui/Container';
import { FormValues, formSchema } from './lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { VideoFormPayload, useUploadForm } from './hooks/useUploadForm';
import { useParams, useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from '@/src/store/authStore';
import { useGetFile } from './hooks/useGetFIle';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import AnimatedSingleElement from '@/src/components/ui/AnimatedSingleElement';

export default function Form() {
  const [agree, setAgree] = useState(false);
  const user = useAuthStore((state) => state.user);
  const pinCode = useAuthStore((state) => state.pinCode);
  const router = useRouter();
  const { submit, isLoading } = useUploadForm();
  const { isLoading: getUploadedLoading, getUploaded } = useGetFile();
  const { store } = useParams();
  const [uploadedCount, setUploadedCount] = useState<null | { count: number; limit: number }>(null);

  const isValidCount = useMemo(() => {
    if (!uploadedCount) return true;
    return uploadedCount.count < uploadedCount.limit;
  }, [uploadedCount]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: user ? user.customer_id : '',
      name: user ? user.name : '',
      email: user ? user.email || '' : '',
      message: '',
      file: '',
    },
  });

  const uploadedFile = watch('file');

  /** Sync user - form */
  useEffect(() => {
    if (user) {
      (async () => {
        let name = user.name || '';
        setValue('email', user.email || '');
        if (user?.video_id) {
          const uploaded = await getUploaded(user.video_id);
          if (uploaded) {
            setValue('file', uploaded.video_url || '');
            name = uploaded.name || name;
            setValue('message', uploaded.message || '');
            if (uploaded.count_edit && uploaded.limit_configuration) {
              setUploadedCount({ count: uploaded.count_edit, limit: uploaded.limit_configuration });
            }
          }
        }
        setValue('name', name);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setValue]);

  /** Handle submit */
  const onSubmit = (data: FormValues) => {
    if (!agree) return;

    if (!pinCode) {
      toast.error('Employee ID is missing!');
      router.push(`/${store}/landing`);
      return;
    }

    const payload: VideoFormPayload = {
      customer_id: data.customer_id,
      name: data.name,
      email: data.email,
      message: data.message,
      ...{ ...(data.file && typeof data.file !== 'string' ? { file: data.file } : {}) },
    };

    submit({ data: payload, pinCode });
  };

  return (
    <>
      {getUploadedLoading && (
        <div className='fixed inset-0 z-9999 grid place-items-center bg-black/20'>
          <LoaderCircle className='text-red h-10 w-10 animate-spin' />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto mt-15 flex max-w-[1143px] flex-col gap-3 pb-[70px] lg:mt-11.5 lg:gap-13 lg:pb-20'
      >
        <div className='col-span-full flex items-center gap-5.5 pr-3'>
          <Image
            src='/images/upload-page/arrow_right.svg'
            width={96}
            height={35}
            alt='Arrow right'
            className='h-auto w-24'
          />
          <h2 className='font-ccep-wide 3xl:text-[50px] text-brown text-[35px] leading-[1.2] font-bold lg:text-[40px]'>
            <AnimatedText as='span' animation='fromRight' split='chars' duration={0.5}>
              Submit Your
            </AnimatedText>
            <br />
            <AnimatedText as='span' animation='fromRight' split='chars' duration={0.5} delay={0.5}>
              Team Video
            </AnimatedText>
          </h2>
        </div>

        <Container className='w-full xl:!px-0'>
          {uploadedCount && (
            <AnimatedSingleElement className='mb-5 lg:mb-10'>
              {uploadedCount.count >= uploadedCount.limit && (
                <Alert className='border-amber-200 bg-amber-50'>
                  <AlertDescription className='text-red'>
                    <strong>Edit Limit Reached:</strong> You have already updated this form{' '}
                    {uploadedCount.count} time(s). Each user can update the form a maximum of{' '}
                    {uploadedCount.limit} time(s).
                  </AlertDescription>
                </Alert>
              )}

              {uploadedCount.count && uploadedCount.count < uploadedCount.limit ? (
                <Alert className='border-blue-200 bg-blue-50'>
                  <AlertDescription className='text-blue-800'>
                    <strong>Notice:</strong> You have updated this form {uploadedCount.count}{' '}
                    time(s). You can update it {uploadedCount.limit - uploadedCount.count} more
                    time(s) (maximum {uploadedCount.limit}).
                  </AlertDescription>
                </Alert>
              ) : null}
            </AnimatedSingleElement>
          )}

          <div className='text-brown grid gap-15 md:grid-cols-2'>
            <div className='flex flex-col gap-4 md:gap-7.5'>
              <p className='font-ccep-wide mb-4 text-lg leading-[1] font-light lg:mb-6.5 lg:text-2xl'>
                Show us what makes your team special for a chance to win an exclusive Coca-Cola
                sponsored team event! This is your opportunity to share your team&apos;s passion,
                creativity, and energy with us.
              </p>

              <Input
                label='Restaurant name'
                required
                placeholder='Restaurant name'
                error={errors.name?.message}
                {...register('name', { required: true })}
              />

              <Input
                label='Email'
                type='email'
                required
                placeholder='Email'
                error={errors.email?.message}
                {...(user?.email
                  ? {
                      value: user.email,
                      disabled: true,
                    }
                  : { ...register('email', { required: true }) })}
              />

              <Textarea
                label='Tell us about your team'
                placeholder='A short description of your team'
                rows={6}
                {...register('message', { required: true })}
              />

              {/* Mobile upload */}
              <div className='md:hidden'>
                <Controller
                  name='file'
                  control={control}
                  rules={{ required: 'File is required' }}
                  render={({ field }) => (
                    <UploadField
                      field={field}
                      error={errors.file?.message}
                      {...(uploadedFile &&
                        typeof uploadedFile === 'string' && { fileUrl: uploadedFile })}
                    />
                  )}
                />
              </div>

              <Checkbox
                label='I agree that Coca-Cola and Metro may use this video for promotional purposes related to the Chefs in Town festival.'
                required
                checked={agree}
                onChange={() => setAgree(!agree)}
              />

              <Button
                className='md:hidden'
                variant='red'
                animation='scaleIn'
                disabled={!agree || isLoading}
                type='submit'
              >
                {isLoading ? (
                  <LoaderCircle className='mx-auto h-7 animate-spin' />
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>

            <div className='hidden flex-col gap-8 md:flex'>
              {/* Desktop upload */}
              <Controller
                name='file'
                control={control}
                rules={{ required: 'File is required' }}
                render={({ field }) => (
                  <UploadField
                    field={field}
                    error={errors.file?.message}
                    className='h-[540px]'
                    {...(uploadedFile &&
                      typeof uploadedFile === 'string' && { fileUrl: uploadedFile })}
                  />
                )}
              />

              <Button
                variant='red'
                animation='scaleIn'
                disabled={!agree || isLoading || getUploadedLoading || !isValidCount}
                type='submit'
              >
                {isLoading ? (
                  <LoaderCircle className='mx-auto h-7 animate-spin' />
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </div>
        </Container>
      </form>
    </>
  );
}
