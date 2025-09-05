// const COLOR_MAP: Record<string, string> = {
//   BLACK: '#000000',
//   'NEO MINT': '#A0DAA9',
//   LILAC: '#BEB2D5',
//   WHITE: '#FFFFFF',
// };

// export const getColorByLabel = (label: string): string | null => {
//   return COLOR_MAP[label] || null;
// };

export const getColorClass = (label: string): string => {
  switch (label) {
    case 'BLACK':
      return 'bg-black/80 text-black';
    case 'NEO MINT':
      return 'bg-[#A0DAA9] text-[#A0DAA9]';
    case 'LILAC':
      return 'bg-[#BEB2D5] text-[#BEB2D5]';
    case 'WHITE':
      return 'bg-white text-black';
    default:
      return 'bg-black/80 text-white';
  }
};

export const getOptionKeyById = (id: number | string): string | null => {
  switch (Number(id)) {
    case 5:
      return 'size';
    case 4:
      return 'color';
    case 9:
      return 'logo_color';
    case 7:
      return 'logo';
    default:
      return null;
  }
};

export const base64ToFile = (base64: string, fileName: string, mimeType: string): File => {
  const byteString = atob(base64.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  return new File([arrayBuffer], fileName, { type: mimeType });
};
