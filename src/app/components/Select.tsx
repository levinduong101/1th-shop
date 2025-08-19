'use client';
import { JSX, useEffect, useRef } from 'react';
import { useState } from 'react';

interface SelectProps {
  optionSelected: string;
  options: string[];
  labelBottom?: string;
  placehoder?: string;
  onSelect: (option: string) => void;
}

export default function Select({
  optionSelected = '',
  options,
  labelBottom,
  placehoder = '',
  onSelect,
}: SelectProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent): void => {
      if (boxRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener('click', fn);
    return (): void => {
      window.removeEventListener('click', fn);
    };
  }, []);

  function handleSelect(option: string): void {
    onSelect(option);
    setOpen(false);
  }

  return (
    <div className='relative w-full'>
      <div className='rounded-lg'>
        <div
          ref={boxRef}
          className='flex cursor-pointer items-center justify-between rounded-[30px] bg-white px-[25px] py-[14px]'
          onClick={() => setOpen(!open)}
        >
          <span
            className={`text-input font-unity-medium text-black ${placehoder && !optionSelected ? '!text-[#8b8b8b]' : ''}`}
          >
            {optionSelected || placehoder}
          </span>
          <svg
            className={`h-5 w-5 transform transition duration-150 ${open ? 'rotate-180' : 'rotate-0'}`}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
          </svg>
        </div>
        {open && (
          <ul className='absolute mt-1 max-h-[180px] w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-md'>
            {options.map((option, index) => (
              <li
                key={index}
                className='font-unity-medium cursor-pointer px-[25px] py-2 text-black hover:bg-gray-100'
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      {labelBottom && (
        <p className='font-unity-regular text-label mt-[10px] text-center text-white'>
          {labelBottom}
        </p>
      )}
    </div>
  );
}
