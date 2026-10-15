import { z } from 'zod';

// Same rule as the backend (backend/src/modules/boards/boards.schema.ts). Used to create and to rename.
export const boardTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
});

export type BoardTitleInput = z.infer<typeof boardTitleSchema>;
