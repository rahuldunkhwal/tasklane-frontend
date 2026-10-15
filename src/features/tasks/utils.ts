import type { Task, TaskPriority } from '@/types/api';
import type { TaskFormValues } from './schemas';

// The company's rule: overdue = not completed AND the due moment has passed.
// dueDate is the END of the due day in the user's time zone, so a task due today isn't overdue yet.
export function isOverdue(task: Task, now = new Date()) {
  return !task.completed && task.dueDate !== null && new Date(task.dueDate) < now;
}

// "20 Oct" this year, "20 Oct 2027" otherwise, in the user's own language and time zone
export function formatDueDate(dueDate: string) {
  const date = new Date(dueDate);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  });
}

// ---------- Date picker <-> API ----------
// <input type="date"> works with "YYYY-MM-DD" (no time, no time zone).
// The API stores the exact moment the task is due: the END of that day in the user's time zone.

// "2026-10-20" → end of 20 Oct in the user's time zone, as ISO (in India: "2026-10-20T18:29:59.999Z")
export function toDueDateIso(dateInput: string): string | null {
  if (!dateInput) return null;
  const [year, month, day] = dateInput.split('-').map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString(); // local time → UTC
}

// The way back, for editing: ISO → "YYYY-MM-DD" of that moment in the user's time zone
export function toDateInputValue(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Today as "YYYY-MM-DD", used as the date picker's minimum for NEW tasks (a hint, not a rule)
export function todayInputValue() {
  return toDateInputValue(new Date().toISOString());
}

// Form values → what the API expects (the date picker's day becomes an exact due moment)
export function fromFormValues(values: TaskFormValues) {
  return {
    title: values.title,
    description: values.description,
    priority: values.priority,
    dueDate: toDueDateIso(values.dueDate),
  };
}

// A task → the form's starting values, for editing
export function toFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: toDateInputValue(task.dueDate),
  };
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
