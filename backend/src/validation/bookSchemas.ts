import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany').max(255, 'Tytuł nie może być dłuższy niż 255 znaków'),
  author: z.string().min(1, 'Autor jest wymagany').max(255, 'Autor nie może być dłuższy niż 255 znaków'),
});

export const updateBookSchema = z.object({
  read: z.boolean(),
});

export const bookIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID musi być liczbą').transform(Number),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type BookIdInput = z.infer<typeof bookIdSchema>;
