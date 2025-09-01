'use client';
import { useEffect, useMemo } from 'react';
import { Button } from '@/src/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { LoaderCircle, Search } from 'lucide-react';
import Input from '@/src/components/ui/Input';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';

const schema = z.object({
  pinCode: z
    .string()
    .min(4, 'PIN Code must be 4 characters')
    .max(4, 'PIN Code must be 4 characters')
    .regex(/^[a-zA-Z0-9]{4}$/, 'PIN Code must be 4 alphanumeric characters'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export default function Popup() {
  const pinCodeStore = useAuthStore((state) => state.pinCode);
  const searchParams = useSearchParams();
  const pinCodeParam = useMemo(() => searchParams.get('pin'), [searchParams]);
  const { auth, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      pinCode: '',
      email: '',
    },
  });

  /** Sync PINcode param into form */
  useEffect(() => {
    if (pinCodeParam) {
      reset({ pinCode: pinCodeParam });
    }
  }, [pinCodeParam, reset]);

  /** Handle submit */
  const onSubmit = (data: FormData) => {
    auth(data.pinCode, data.email);
  };

  return (
    <Dialog open={!Boolean(pinCodeStore) || Boolean(pinCodeParam && pinCodeStore !== pinCodeParam)}>
      <DialogContent className='sm:max-w-[425px]' showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>LOGIN</DialogTitle>
          <DialogDescription>
            Please enter the PIN code and email to access the content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
          <Input
            placeholder='PIN code'
            className='!font-ccep'
            error={errors.pinCode?.message}
            {...(pinCodeParam
              ? {
                  value: pinCodeParam,
                  disabled: true,
                }
              : { ...register('pinCode', { required: true }) })}
          />
          <Input
            {...register('email', { required: true })}
            placeholder='Email'
            className='!font-ccep'
            error={errors.email?.message}
            disabled={isLoading}
          />

          <Button
            type='submit'
            variant='red'
            fullWidth
            className='!font-ccep !h-12.5 !text-base'
            animation='scaleIn'
            iconAnimation={<Search size={20} />}
            disabled={isLoading}
          >
            {isLoading ? <LoaderCircle className='mx-auto h-7 animate-spin' /> : 'Login'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
