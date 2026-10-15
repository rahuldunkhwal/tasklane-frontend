import { z } from 'zod';

// Same limits as the backend (backend/src/modules/tasks/tasks.schema.ts). Used to add and to edit.
export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  description: z.string().trim().max(2000, 'Description must be at most 2000 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  // What the date picker gives: "" (no due date) or "YYYY-MM-DD".
  // It's turned into "end of that day in the user's time zone" just before sending.
  dueDate: z.string(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
