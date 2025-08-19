'use client';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import React, { forwardRef } from 'react';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  required?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, checked, onChange, ...props }, ref) => {
    // Sử dụng checked từ props (từ register) thay vì internal state
    const isChecked = checked || false;

    const handleClick = () => {
      const newChecked = !isChecked;

      // Trigger onChange cho register
      if (onChange) {
        const event = {
          target: {
            name: props.name,
            checked: newChecked,
            value: newChecked.toString(),
            type: 'checkbox',
          },
          currentTarget: {
            name: props.name,
            checked: newChecked,
            value: newChecked.toString(),
            type: 'checkbox',
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <div className='flex flex-col gap-1'>
        <label className='flex cursor-pointer items-start gap-3' onClick={handleClick}>
          {/* Hidden input for react-hook-form */}
          <input ref={ref} type='checkbox' className='sr-only' {...props} />

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

          <span className='text-brown font-ccep text-sm font-medium'>{label}</span>
        </label>

        {error && <p className='text-xs text-red-500'>{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
