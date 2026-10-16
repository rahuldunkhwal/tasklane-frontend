import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/api';
import { formatDueDate, isOverdue, PRIORITY_LABELS } from '../utils';

// One pill style; the colour only changes to carry real meaning, never for decoration.
const chip =
  'inline-flex items-center gap-1 rounded-full px-[9px] py-0.5 text-xs font-medium leading-4';

// What a task LOOKS like (title, description, chips), with no behaviour.
// Shared by the real card and the floating copy shown while dragging.
export function TaskSummary({ task }: { task: Task }) {
  const overdue = isOverdue(task);
  // "Medium" is the default, so it adds no information — only High and Low get a chip.
  const showPriority = task.priority === 'high' || task.priority === 'low';
  const hasChips = task.completed || showPriority || Boolean(task.dueDate);

  return (
    <>
      <span
        className={cn(
          'text-sm font-medium wrap-break-word',
          task.completed && 'text-ink-muted line-through',
        )}
      >
        {task.title}
      </span>

      {task.description && (
        <span className="truncate text-xs text-ink-muted">{task.description}</span>
      )}

      {hasChips && (
        <span className="flex flex-wrap items-center gap-1.5">
          {task.completed && (
            <span className={cn(chip, 'bg-brand-tint text-brand-strong')}>Done</span>
          )}
          {showPriority && (
            <span
              className={cn(
                chip,
                task.priority === 'high'
                  ? 'bg-warning-tint text-warning-ink'
                  : 'bg-sunken text-ink-muted',
              )}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
          )}
          {task.dueDate && (
            <span
              className={cn(
                chip,
                overdue ? 'bg-danger-tint text-danger' : 'bg-sunken text-ink-muted',
              )}
            >
              <CalendarIcon className="size-3" />
              {overdue ? `Overdue · ${formatDueDate(task.dueDate)}` : formatDueDate(task.dueDate)}
            </span>
          )}
        </span>
      )}
    </>
  );
}
