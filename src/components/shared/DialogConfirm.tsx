'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { LoaderCircle } from 'lucide-react';

interface DialogConfirmProps {
  title: string;
  content?: React.ReactNode | string;
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: () => void;
  className?: string;
  confirmText?: string;
  cancelText?: string;
}

export function DialogConfirm({
  title,
  content,
  open,
  onClose,
  isLoading = false,
  onSubmit,
  className,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: DialogConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn('sm:max-w-[425px]', className)} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {content && (
          <DialogDescription className='text-muted-foreground mt-2 text-base'>
            {content}
          </DialogDescription>
        )}

        <DialogFooter className='mt-4 flex justify-end gap-2'>
          <Button
            type='button'
            variant='brown'
            onClick={onClose}
            disabled={isLoading}
            className='!font-ccep h-10 !text-base'
          >
            {cancelText}
          </Button>
          <Button
            variant='red'
            type='button'
            onClick={onSubmit}
            disabled={isLoading}
            className='!font-ccep h-10 !text-base'
          >
            {isLoading ? <LoaderCircle className='mx-auto h-7 animate-spin' /> : <>{confirmText}</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
