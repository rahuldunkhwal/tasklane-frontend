import { CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/api';
import { formatDueDate, isOverdue, PRIORITY_LABELS } from '../utils';

// Red is kept for "Overdue", so priorities use calmer styles
const PRIORITY_BADGE = { high: 'default', medium: 'secondary', low: 'outline' } as const;

// What a task LOOKS like (title, description, badges), with no behaviour.
// Shared by the real card and the floating copy shown while dragging.
export function TaskSummary({ task }: { task: Task }) {
  const overdue = isOverdue(task);

  return (
    <>
      <span
        className={cn(
          'text-sm break-words',
          task.completed && 'text-muted-foreground line-through',
        )}
      >
        {task.title}
      </span>

      {task.description && (
        <span className="line-clamp-2 text-xs text-muted-foreground">{task.description}</span>
      )}

      <span className="flex flex-wrap items-center gap-1.5">
        <Badge variant={PRIORITY_BADGE[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
        {task.dueDate && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs',
              overdue ? 'text-destructive' : 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="size-3" />
            {formatDueDate(task.dueDate)}
          </span>
        )}
        {overdue && <Badge variant="destructive">Overdue</Badge>}
      </span>
    </>
  );
}
