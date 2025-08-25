// zod schema for your form (all required except `message`), file must be MP4 or MOV
import { z } from 'zod';

const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']; // quicktime = .mov
const MAX_FILE_SIZE = 200 * 1024 * 1024; // optional: 200MB

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().optional(),
  file: z
    .instanceof(File, { message: 'Video file is required' })
    .refine(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file.type) || /\.(mp4|mov)$/i.test(file.name),
      'Only MP4 or MOV files are allowed',
    )
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File is too large'), // optional
});

export type FormValues = z.infer<typeof formSchema>;
