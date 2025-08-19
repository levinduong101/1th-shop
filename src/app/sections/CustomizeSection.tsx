'use client';
import Image from 'next/image';
import { JSX, useState } from 'react';

import Footer from '../components/Footer';
import Input from '../components/Input';
import Select from '../components/Select';

interface CustomizeSectionProps {
  onChangePage: (type: 'next' | 'home') => void;
}
interface State {
  name: string;
  size: string;
}

const options = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function CustomizeSection({ onChangePage }: CustomizeSectionProps): JSX.Element {
  const [state, setState] = useState<State>({
    name: '',
    size: options[0],
  });

  function onSelect(option: string): void {
    setState({ ...state, size: option });
  }

  return (
    <div className='mw-screen flex flex-col items-center'>
      <div className='w-full bg-white'>
        <div className='page-padding flex flex-col items-center'>
          <h3 className='text-heading'>Personalisieren</h3>

          {/* Show custom */}
          <div className='relative my-[60px]'>
            <Image src='/images/custom_logo.png' width={305} height={250} alt='customize' />
            <div className='absolute top-1/2 right-[32px] h-[100px] w-[180px] -translate-y-[10px] -rotate-[5deg] overflow-hidden'>
              <p className='custom-name px-[3px]'>{state.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className='page-padding w-full grow !py-0'>
        <div className='flex -translate-y-[12px] flex-col gap-[15px]'>
          <Input
            labelBottom={true}
            labelContent='Personalisieren Sie Ihr Hemd'
            labelCenter={true}
            placeholder='Name'
            center={true}
            font='black'
            value={state.name}
            onInput={(value: string) => setState({ ...state, name: value })}
          />
          <Select
            options={options}
            optionSelected={state.size}
            labelBottom='Wählen Sie eine Größe'
            onSelect={onSelect}
          />
        </div>
      </div>

      <div className='page-padding w-full'>
        <Footer onChangePage={onChangePage} buttonText='WEITER' />
      </div>
    </div>
  );
}

export default CustomizeSection;
