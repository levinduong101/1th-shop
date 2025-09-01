import { z } from 'zod';

export const ACCEPTED_VIDEO_TYPES = [
  'video/mp4', // MP4 container (H.264, HEVC, AV1)
  'video/quicktime', // MOV container (H.264, HEVC)
  'video/x-matroska', // MKV container (AV1)
];

// const ACCEPTED_EXTENSIONS = /\.(mp4|mov|mkv)$/i;
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export const formSchema = z.object({
  customer_id: z.union([z.string().min(1, 'Customer_id is required'), z.number()]),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().optional(),
  // file: z.union([
  //   z.string().url('Invalid file URL'),
  //   z.instanceof(File).refine(
  //     (file) =>
  //       ACCEPTED_VIDEO_TYPES.includes(file.type) ||
  //       ACCEPTED_EXTENSIONS.test(file.name),
  //     'Only MP4, MOV, or MKV files are allowed',
  //   ).refine(
  //     (file) => file.size <= MAX_FILE_SIZE,
  //     'File is too large'
  //   ),
  // ]),
  file: z
    .instanceof(File, { message: 'Video file is required' })
    .refine(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file.type) || /\.(mp4|mov)$/i.test(file.name),
      'Only MP4 or MOV files are allowed',
    )
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File is too large'), // optional
});

export type FormValues = z.infer<typeof formSchema>;
