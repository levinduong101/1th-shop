'use client';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Search } from 'lucide-react';
import Input from '@/src/components/ui/Input';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useSearchParams } from 'next/navigation';

const schema = z.object({
  pinCode: z.string().min(1, 'PIN Code is required'),
});

type FormData = z.infer<typeof schema>;

export default function Popup() {
  const setPinCode = useCheckoutStore((state) => state.setPinCode);
  const checkoutStore = useCheckoutStore((state) => state.formStore);
  const [open, setOpen] = useState(Boolean(!checkoutStore?.pinCode));
  const searchParams = useSearchParams();

  const pinCodeParam = useMemo(() => searchParams.get('pin'), [searchParams]);

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
    // eslint-disable-next-line no-console
    console.log('Submitted PIN Code:', data.pinCode);
    setPinCode(data.pinCode);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
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
          >
            Check PIN Code
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
