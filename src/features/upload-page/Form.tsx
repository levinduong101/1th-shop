'use client';
import React, { useEffect, useState } from 'react';
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
import { useUploadForm } from './hooks/useUploadForm';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from '@/src/store/authStore';

export default function Form() {
  const [agree, setAgree] = useState(false);
  const user = useAuthStore((state) => state.user);
  const pinCode = useAuthStore((state) => state.pinCode);
  const router = useRouter();
  const { submit, isLoading } = useUploadForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user ? user.name : '',
      email: user ? user.email : '',
      message: '',
      file: null as unknown as File,
    },
  });

  /** Sync user - form */
  useEffect(() => {
    if (user) {
      setValue('email', user.email || '');
      setValue('name', user.name || '');
    }
  }, [user, setValue]);

  /** Handle submit */
  const onSubmit = (data: FormValues) => {
    if (!agree) return;

    if (!pinCode) {
      toast.error('Employee ID is missing!');
      router.push('/');
      return;
    }

    submit(data, pinCode);
  };

  return (
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

      <Container className='w-full lg:!px-0'>
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
              {...(user?.name
                ? {
                    value: user.name,
                    disabled: true,
                  }
                : { ...register('name', { required: true }) })}
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

            <div className='md:hidden'>
              <Controller
                name='file'
                control={control}
                rules={{ required: 'File is required' }}
                render={({ field }) => <UploadField field={field} error={errors.file?.message} />}
              />
            </div>

            <Checkbox
              label='I agree that Coca-Cola and Metro may use this video for promotional purposes related to the Chefs in Town festival.'
              required
              checked={agree}
              onChange={() => setAgree(!agree)}
            />

            <Button variant='red' animation='scaleIn' className='md:hidden'>
              Submit Application
            </Button>
          </div>

          <div className='hidden flex-col gap-8 md:flex'>
            <Controller
              name='file'
              control={control}
              rules={{ required: 'File is required' }}
              render={({ field }) => (
                <UploadField field={field} error={errors.file?.message} className='h-[540px]' />
              )}
            />

            <Button variant='red' animation='scaleIn' type='submit' disabled={!agree || isLoading}>
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
  );
}
