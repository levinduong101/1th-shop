'use client';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import React, { forwardRef } from 'react';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string | React.ReactNode;
  error?: string;
  required?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, checked, onChange, ...props }, ref) => {
    const isChecked = checked || false;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className='flex flex-col gap-1'>
        <label className='flex cursor-pointer items-start gap-3'>
          {/* Hidden input for react-hook-form */}
          <input
            ref={ref}
            type='checkbox'
            className='sr-only'
            checked={isChecked}
            onChange={handleChange}
            {...props}
          />

          {/* Custom checkbox div */}
          <div
            className={clsx(
              'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border-2 transition-all duration-200',
              isChecked
                ? 'border-red-500 bg-red-500'
                : 'border-gray-300 bg-white hover:border-gray-400',
              className,
            )}
          >
            {isChecked && <Check size={16} className='stroke-[3] text-white' />}
          </div>

          {typeof label === 'string' ? (
            <span className='text-brown font-ccep text-sm font-medium'>{label}</span>
          ) : (
            label
          )}
        </label>

        {error && <p className='text-xs text-red-500'>{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
