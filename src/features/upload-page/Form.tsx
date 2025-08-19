'use client';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/src/components/ui/Button';
import Checkbox from '@/src/components/ui/Checkbox';
import Input from '@/src/components/ui/Input';
import Textarea from '@/src/components/ui/TextArea';
import UploadField from '@/src/components/ui/UploadField';

export default function Form() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      restaurantName: '',
      email: '',
      description: '',
      agreement: false,
    },
  });

  /** Handle submit */
  const onSubmit = (data: {
    restaurantName: string;
    email: string;
    description: string;
    agreement: boolean;
  }) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-15 md:grid-cols-2'>
      <div className='flex flex-col gap-4 md:gap-7.5'>
        <p className='font-ccep-wide mb-4 text-lg font-light'>
          Show us what makes your team special for a chance to win an exclusive Coca-Cola sponsored
          team event! This is your opportunity to share your team&apos;s passion, creativity, and
          energy with us.
        </p>

        <Input
          label='Restaurant name'
          required
          placeholder='Restaurant name'
          {...register('restaurantName', { required: true })}
        />

        <Input
          label='Email'
          type='email'
          required
          placeholder='Email'
          {...register('email', { required: true })}
        />

        <Textarea
          label='Tell us about your team'
          placeholder='A short description of your team'
          rows={7}
          {...register('description', { required: true })}
        />

        <div className='md:hidden'>
          <UploadField />
        </div>

        <Checkbox
          label='I agree that Coca-Cola and Metro may use this video for promotional purposes related to the Chefs in Town festival.'
          required
          checked={watch('agreement')}
          {...register('agreement', { required: true })}
        />

        <Button variant='red' arrowAnimation className='md:hidden'>
          Submit Application
        </Button>
      </div>

      <div className='hidden flex-col gap-8 md:flex'>
        <UploadField className='h-[540px]' />

        <Button variant='red' arrowAnimation type='submit'>
          Submit Application
        </Button>
      </div>
    </form>
  );
}
