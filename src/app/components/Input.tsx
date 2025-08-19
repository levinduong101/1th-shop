'use client';
import { JSX } from 'react';

interface InputProps {
  labelTop?: boolean;
  labelBottom?: boolean;
  labelCenter?: boolean;
  labelContent?: string;
  placeholder?: string;
  center?: boolean;
  font?: 'medium' | 'black';
  value: string;
  onInput: (value: string) => void;
}

function Input({
  labelTop,
  labelBottom,
  labelCenter,
  labelContent,
  placeholder,
  center,
  font = 'medium',
  value,
  onInput,
}: InputProps): JSX.Element {
  const labelClass = `
        font-unity-regular text-label text-white ${labelTop ? 'mb-[10px]' : labelBottom ? 'mt-[10px]' : ''} ${labelCenter ? 'text-center' : ''}
    `;

  return (
    <div>
      {labelTop && <p className={labelClass}>{labelContent}</p>}
      <input
        type='text'
        placeholder={placeholder}
        className={`${center ? 'text-center' : ''} ${font === 'black' ? 'font-unity-black' : 'font-unity-medium'}`}
        value={value}
        onChange={(e) => onInput(e.target.value)}
      />
      {labelBottom && <p className={labelClass}>{labelContent}</p>}
    </div>
  );
}

export default Input;
