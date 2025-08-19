'use client';
import React from 'react';

interface ButtonProps {
  onclick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, onclick }) => {
  return (
    <button
      className='font-unity-black cursor-pointer border-white bg-white/25 text-white transition-all duration-300 ease-in-out hover:border-white hover:bg-white hover:text-red-700'
      onClick={onclick}
    >
      {children}
    </button>
  );
};

export default Button;
