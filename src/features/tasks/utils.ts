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

// "YYYY-MM-DD" <-> a local Date, for the calendar picker (built from parts so the day never
// shifts across time zones, unlike new Date("YYYY-MM-DD") which is parsed as UTC).
export function ymdToDate(ymd: string): Date | undefined {
  if (!ymd) return undefined;
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function dateToYmd(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// How a chosen date reads on the picker button, e.g. "16 Oct" (adds the year if it's not this one)
export function formatYmd(ymd: string): string {
  const date = ymdToDate(ymd);
  if (!date) return '';
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  });
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

// ---------- Drag & drop ----------

// Each column's drop zone is named "board:<id>", so it can't be confused with a task id
const DROP_PREFIX = 'board:';
export const boardDropId = (boardId: string) => `${DROP_PREFIX}${boardId}`;

// Which board an id belongs to: a column's drop zone, or a task (looked up in the list)
export function boardIdOf(tasks: Task[], id: string): string | undefined {
  if (id.startsWith(DROP_PREFIX)) return id.slice(DROP_PREFIX.length);
  return tasks.find((t) => t.id === id)?.boardId;
}

// The cache holds ONE flat list of every task; each column shows its board's tasks in list order.
// This returns a new list where the task sits in `boardId` at position `index` of that board.
export function placeTask(tasks: Task[], taskId: string, boardId: string, index: number): Task[] {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return tasks;

  const rest = tasks.filter((t) => t.id !== taskId);
  const moved = { ...task, boardId };
  // Insert just before the task that is currently at that position in the board...
  const anchor = rest.filter((t) => t.boardId === boardId)[index];
  if (!anchor) return [...rest, moved]; // ...or after everything (= last in that board)

  const anchorAt = rest.indexOf(anchor);
  return [...rest.slice(0, anchorAt), moved, ...rest.slice(anchorAt)];
}

// Where a task currently is: its board and its position (0 = top) among that board's tasks
export function positionOf(tasks: Task[], taskId: string) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;
  const index = tasks.filter((t) => t.boardId === task.boardId).findIndex((t) => t.id === taskId);
  return { boardId: task.boardId, index };
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
