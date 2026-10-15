import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Board } from '@/types/api';
import { useTasks } from '../api/get-tasks';
import { useTaskFilters } from '../filters';
import { boardDropId } from '../utils';
import { AddTaskDialog } from './add-task-dialog';
import { TaskCard } from './task-card';

// The tasks of ONE board, plus "+ Add task". Every column renders this, but there's still
// only one request: they all read the same cached list and keep their own board's tasks.
export function BoardTasks({ board }: { board: Board }) {
  // Same filters as the filter bar (read from the URL) → same cached request
  const { filters, filtering } = useTaskFilters();
  const tasks = useTasks(filters);
  // A board shared with me is view-only: nothing in it can be changed (the server enforces it too)
  const readOnly = board.role === 'viewer';

  // The whole task area is a drop zone, so tasks can be dropped even into an EMPTY column.
  // Switched off for view-only boards, so tasks can't be dropped into them.
  const { setNodeRef, isOver } = useDroppable({ id: boardDropId(board.id), disabled: readOnly });

  if (tasks.isPending) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading tasks">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
    );
  }

  if (tasks.isError) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-4 text-center">
        <p className="text-sm text-muted-foreground">Couldn't load tasks.</p>
        <Button size="sm" variant="outline" onClick={() => void tasks.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  // The cached list is already in the right order, so filtering keeps each board's order
  const boardTasks = tasks.data.filter((task) => task.boardId === board.id);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      {/* SortableContext: these cards can be reordered, and dnd-kit animates the others out of the way */}
      <SortableContext
        id={board.id}
        items={boardTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className={cn(
            'flex min-h-16 flex-1 flex-col gap-2 overflow-y-auto rounded-2xl p-0.5 transition-colors [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar]:w-1.5',
            // Lime dashed drop target while a task hovers over this column
            isOver && 'bg-brand-tint outline-2 outline-dashed outline-brand-line',
          )}
        >
          {boardTasks.length === 0 ? (
            <li className="rounded-xl border border-dashed border-border-strong/50 p-4 text-center text-sm text-ink-muted">
              {filtering ? 'No matching tasks' : 'No tasks yet'}
            </li>
          ) : (
            boardTasks.map((task) => (
              <li key={task.id}>
                {/* While filtering, some tasks are hidden, so "position 2" would be ambiguous:
                    dragging is switched off until the filters are cleared */}
                <TaskCard task={task} dragDisabled={filtering} readOnly={readOnly} />
              </li>
            ))
          )}
        </ul>
      </SortableContext>
      {!readOnly && (
        <div className="shrink-0 px-1 pt-1">
          <AddTaskDialog board={board} />
        </div>
      )}
    </div>
  );
}
