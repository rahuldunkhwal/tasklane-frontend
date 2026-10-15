import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getErrorMessage } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/api';
import { useUpdateTask } from '../api/update-task';
import { formatDueDate, isOverdue, PRIORITY_LABELS } from '../utils';
import { EditTaskDialog } from './edit-task-dialog';

// Red is kept for "Overdue", so priorities use calmer styles
const PRIORITY_BADGE = { high: 'default', medium: 'secondary', low: 'outline' } as const;

export function TaskCard({ task }: { task: Task }) {
  const updateTask = useUpdateTask();
  const [editOpen, setEditOpen] = useState(false);
  const overdue = isOverdue(task);

  // Ticks instantly (optimistic update); if the server refuses, it un-ticks and a toast explains
  const toggleCompleted = (completed: boolean) =>
    updateTask.mutate(
      { id: task.id, completed },
      {
        onError: (error) =>
          toast.error(`Couldn't update "${task.title}"`, { description: getErrorMessage(error) }),
      },
    );

  return (
    <article className="flex gap-3 rounded-lg border bg-background p-3 shadow-xs">
      <Checkbox
        className="mt-0.5"
        checked={task.completed}
        onCheckedChange={(checked) => toggleCompleted(checked === true)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`}
      />

      {/* The rest of the card is one button that opens the edit dialog
          (kept separate from the checkbox, so ticking doesn't open it) */}
      <button
        type="button"
        onClick={() => setEditOpen(true)}
        className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-sm text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
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
      </button>

      <EditTaskDialog task={task} open={editOpen} onOpenChange={setEditOpen} />
    </article>
  );
}
