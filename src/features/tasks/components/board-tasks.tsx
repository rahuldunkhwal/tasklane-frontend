import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Board } from '@/types/api';
import { useTasks } from '../api/get-tasks';
import { AddTaskDialog } from './add-task-dialog';
import { TaskCard } from './task-card';

// The tasks of ONE board, plus "+ Add task". Every column renders this, but there's still
// only one request: they all read the same cached list and keep their own board's tasks.
export function BoardTasks({ board }: { board: Board }) {
  const tasks = useTasks();

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

  // The server already sorts by board and position, so filtering keeps the right order
  const boardTasks = tasks.data.filter((task) => task.boardId === board.id);

  return (
    <div className="flex flex-col gap-2">
      {boardTasks.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No tasks yet
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {boardTasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ul>
      )}
      <AddTaskDialog board={board} />
    </div>
  );
}
