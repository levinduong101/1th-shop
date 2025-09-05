import apiProxy from '@/src/lib/api-proxy';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useProductStore } from '@/src/store/productStore';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

export type PersonalizeHoodieOrder = {
  personalizehoodieorder_id: number;
  product_id: number;
  product_sku: string;
  employee_id: string | null;
  color: string | null;
  logo: string | null;
  restaurant_name: string | null;
  qty: number;
  custom_name: string | null;
  request_size: string | null;
  employee_firstname: string | null;
  employee_lastname: string | null;
  email: string;
  phone: string | null;
  street: string | null;
  street2: string | null;
  region: string | null;
  postcode: string | null;
  city: string | null;
  country: string | null;
  customer_id: number;
  order_id: number | null;
  creation_time: string;
  update_time: string;
  status: string;
  text_color: string;
};

export const useAppyDraft = () => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const setProductStore = useProductStore((state) => state.setFormStore);
  const setCheckoutStore = useCheckoutStore((state) => state.setFormStore);
  const productStore = useProductStore((state) => state.formStore);

  return {
    isLoading,

    async applyDraftOrder({
      orderId,
      colorMapById,
      sizeMapById,
      logoColorMapById
    }: {
      orderId: string | number;
      colorMapById: Map<string, string>;
      sizeMapById: Map<string, string>;
      logoColorMapById: Map<string, string>;
    }) {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);

      try {
        const res = await apiProxy.get('/checkout/get-draft', {
          params: { id: orderId },
        });

        const data: PersonalizeHoodieOrder = res?.data?.getPersonalizeHoodieOrderById;
        if (!data) {
          throw new Error('Draft order not found');
        }

        let logoFile = null;

        if (data?.logo) {
          try {
            logoFile = await urlToFile(data.logo, 'logo');
          } catch (error) {
            console.warn('Failed to convert logo URL to file:', error);
            logoFile = data.logo;
          }
        }

        setProductStore({
          ...productStore!,
          color: data?.color
            ? { key: data.color, label: colorMapById.get(data.color) || '' }
            : { key: '', label: '' },
          logoColor: data?.text_color
            ? { key: data.text_color, label: logoColorMapById.get(data.text_color) || '' }
            : { key: '', label: '' },
          size: data?.request_size
            ? { key: data.request_size, label: sizeMapById.get(data.request_size) || '' }
            : { key: '', label: '' },
          file: logoFile as unknown as File,
        });

        setCheckoutStore({
          street: data?.street || '',
          street2: data?.street2 || '',
          district: data?.city || '',
          email: data?.email || '',
          phone: data?.phone || '',
          postcode: data?.postcode || '',
          restaurantName: data?.restaurant_name || '',
        });
      } catch (error: any) {
        toast.error(error?.message || 'Failed to apply draft order');
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    }
  };
};


// Helper function to convert image URL to File object
async function urlToFile(url: string, filename: string): Promise<File> {
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;

  const response = await fetch(proxyUrl, {
    method: 'GET',
    headers: {
      'Accept': 'image/*',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}. ${errorData.error || ''
      }`
    );
  }

  const blob = await response.blob();

  let extension = '';
  const urlExtension = url.split('.').pop()?.toLowerCase();
  const contentType = response.headers.get('content-type');

  if (urlExtension && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(urlExtension)) {
    extension = `.${urlExtension}`;
  } else if (contentType) {
    const typeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg'
    };
    extension = typeMap[contentType] || '.png';
  } else {
    extension = '.png'; // fallback
  }

  const newFile = new File([blob], `${filename}${extension}`, {
    type: blob.type || contentType || 'image/png',
    lastModified: Date.now(),
  });

  (newFile as CustomFile).isUpdate = true;

  return newFile as CustomFile;
}

export type CustomFile = File & { isUpdate?: boolean };