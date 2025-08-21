import type { Color } from './data';

export const getColorClass = (color: Color) => {
  switch (color) {
    case 'RED':
      return 'bg-red text-red';
    case 'WHITE':
      return 'bg-white text-black/10';
    default:
      return 'bg-gray text-gray';
  }
};
