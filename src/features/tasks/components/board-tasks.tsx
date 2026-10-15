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

  // The whole task area is a drop zone, so tasks can be dropped even into an EMPTY column
  const { setNodeRef, isOver } = useDroppable({ id: boardDropId(board.id) });

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
    <div className="flex flex-col gap-2">
      {/* SortableContext: these cards can be reordered, and dnd-kit animates the others out of the way */}
      <SortableContext
        id={board.id}
        items={boardTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className={cn(
            'flex min-h-16 flex-col gap-2 rounded-lg transition-colors',
            isOver && 'bg-muted/60', // light highlight while a task hovers over this column
          )}
        >
          {boardTasks.length === 0 ? (
            <li className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              {filtering ? 'No matching tasks' : 'No tasks yet'}
            </li>
          ) : (
            boardTasks.map((task) => (
              <li key={task.id}>
                {/* While filtering, some tasks are hidden, so "position 2" would be ambiguous:
                    dragging is switched off until the filters are cleared */}
                <TaskCard task={task} dragDisabled={filtering} />
              </li>
            ))
          )}
        </ul>
      </SortableContext>
      <AddTaskDialog board={board} />
    </div>
  );
}
