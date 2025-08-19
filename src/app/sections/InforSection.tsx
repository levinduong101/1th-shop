'use client';
import { JSX, useState } from 'react';

import Footer from '../components/Footer';
import Input from '../components/Input';
import Select from '../components/Select';

interface InforSectionProps {
  onChangePage: (type: 'next' | 'home') => void;
}

function InforSection({ onChangePage }: InforSectionProps): JSX.Element {
  const [state, setState] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  return (
    <div className='page-padding flex flex-col items-center gap-[25px]'>
      <h3 className='text-heading text-center text-white'>Füllen Sie die Informationen aus</h3>
      <div className='flex w-full grow flex-col justify-center gap-[15px]'>
        {/* ID */}
        <Input
          labelTop={true}
          labelContent='Geben Sie Ihre Mitarbeiter-ID ein'
          placeholder='ID-Nummer'
          center={true}
          value={state.id}
          onInput={(value: string) => setState({ ...state, id: value })}
        />

        {/* Name */}
        <Input
          labelTop={true}
          labelContent='Vor- und Nachname'
          placeholder='Valentina'
          value={state.name}
          onInput={(value: string) => setState({ ...state, name: value })}
        />

        {/* Email */}
        <Input
          labelTop={true}
          labelContent='E-Mail-Adresse'
          placeholder='example@gmail.com'
          value={state.email}
          onInput={(value: string) => setState({ ...state, email: value })}
        />

        {/* Phone */}
        <Input
          labelTop={true}
          labelContent='Telefonnummer'
          placeholder='+49 123 456 7890'
          value={state.phone}
          onInput={(value: string) => setState({ ...state, phone: value })}
        />

        {/* Address */}
        <div className='flex w-full flex-col gap-[10px]'>
          <Input
            labelTop={true}
            labelContent='Geben Sie Ihre Adresse ein'
            placeholder='Straße und Hausnummer'
            value={state.address}
            onInput={(value: string) => setState({ ...state, address: value })}
          />

          <Select
            options={['Germany', 'France', 'Italy', 'Spain', 'Germany', 'France', 'Italy', 'Spain']}
            placehoder='Stadt, Deutschland'
            optionSelected={state.city}
            onSelect={(option: string) => setState({ ...state, city: option })}
          />
        </div>
      </div>
      <Footer onChangePage={onChangePage} buttonText='ABSENDEN' />
    </div>
  );
}

export default InforSection;
