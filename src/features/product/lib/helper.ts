export const getColorClass = (color: string) => {
  switch (color) {
    case 'RED':
      return 'bg-red text-red';
    case 'WHITE':
      return 'bg-white text-black/10';
    case 'GRAY':
      return 'bg-gray text-gray';
    default:
      return 'bg-black/80 text-black/80';
  }
};
