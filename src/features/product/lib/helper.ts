const COLOR_MAP: Record<string, string> = {
  BLACK: '#000000',
  'NEO MINT': '#A0DAA9',
  LILAC: '#BEB2D5',
};

export const getColorByLabel = (label: string): string | null => {
  return COLOR_MAP[label] || null;
};

export const getColorClass = (label: string): string => {
  switch (label) {
    case 'BLACK':
      return 'bg-black/80 text-black';
    case 'NEO MINT':
      return 'bg-[#A0DAA9] text-[#A0DAA9]';
    case 'LILAC':
      return 'bg-[#BEB2D5] text-[#BEB2D5]';
    default:
      return 'bg-black/80 text-white';
  }
};
