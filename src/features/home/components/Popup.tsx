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
  pinCode: z.string().min(1, 'PIN Code is required'),
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
    auth(data.pinCode);
  };

  return (
    <Dialog open={!Boolean(pinCodeStore)}>
      <DialogContent className='sm:max-w-[425px]' showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>PIN Code</DialogTitle>
          <DialogDescription>Please enter the PIN code to access the content.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
          <Input
            {...register('pinCode', { required: true })}
            placeholder='Enter PIN Code'
            className='!font-ccep'
            error={errors.pinCode?.message}
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
            {isLoading ? <LoaderCircle className='mx-auto h-7 animate-spin' /> : 'Check PIN Code'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
