import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { getErrorMessage } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/api';
import { useUpdateTask } from '../api/update-task';
import { EditTaskDialog } from './edit-task-dialog';
import { TaskSummary } from './task-summary';

type TaskCardProps = {
  task: Task;
  dragDisabled?: boolean; // true while filtering: no handle, can't be dragged
  readOnly?: boolean; // true on boards shared with me: can't tick, edit or drag
};

export function TaskCard({ task, dragDisabled = false, readOnly = false }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const [editOpen, setEditOpen] = useState(false);
  const noDrag = dragDisabled || readOnly;

  // Makes this card draggable and sortable. dnd-kit tells us how far to shift it (transform)
  // while things move, and whether it's the one being dragged right now.
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: noDrag }); // disabled = can't be dragged OR dropped onto

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
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      // The card being dragged stays as a faded placeholder; a floating copy follows the pointer
      className={cn(
        'group/card flex gap-2 rounded-[16px] border bg-surface p-3 shadow-(--shadow-card) transition-colors',
        !noDrag && 'hover:border-border-strong',
        isDragging && 'opacity-40',
      )}
    >
      {/* Drag handle: the ONLY place a drag starts (mouse, touch or keyboard: Space, arrows, Space).
          touch-none: on phones, touching here drags instead of scrolling the page.
          Hidden while filtering and on view-only boards, because dragging is switched off then. */}
      {!noDrag && (
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Move "${task.title}"`}
          className="-ml-1 flex h-5 cursor-grab touch-none items-center rounded-sm text-muted-foreground opacity-0 transition-opacity outline-none group-hover/card:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing [@media(hover:none)]:opacity-100"
        >
          <GripVerticalIcon className="size-4" />
        </button>
      )}

      <Checkbox
        className="mt-0.5 size-[18px] rounded-[6px] border-2"
        checked={task.completed}
        disabled={readOnly} // view-only: shows done / not done, but can't be changed
        onCheckedChange={(checked) => toggleCompleted(checked === true)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`}
      />

      {readOnly ? (
        // View-only: just the details, nothing to click
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <TaskSummary task={task} />
        </div>
      ) : (
        <>
          {/* Clicking the text opens the edit dialog */}
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-sm text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <TaskSummary task={task} />
          </button>
          <EditTaskDialog task={task} open={editOpen} onOpenChange={setEditOpen} />
        </>
      )}
    </article>
  );
}

// The floating copy that follows the pointer while dragging (looks the same, does nothing)
export function TaskCardPreview({ task }: { task: Task }) {
  return (
    <div className="flex rotate-2 cursor-grabbing gap-2 rounded-lg border border-brand-line bg-surface p-3 shadow-(--shadow-lift)">
      <GripVerticalIcon className="-ml-1 size-4 text-muted-foreground" />
      <Checkbox className="mt-0.5" checked={task.completed} tabIndex={-1} aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <TaskSummary task={task} />
      </div>
    </div>
  );
}
