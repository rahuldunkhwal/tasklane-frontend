import { BoardsList } from '@/features/boards/components/boards-list';
import { CreateBoardDialog } from '@/features/boards/components/create-board-dialog';
import { BoardTasks } from '@/features/tasks/components/board-tasks';
import { TaskDragAndDrop } from '@/features/tasks/components/task-drag-and-drop';

// Home is where features are combined: boards, with each board's tasks inside,
// all wrapped in drag & drop so tasks can move within and between boards.
// (Search, filters and the dashboard join in later phases.)
export function HomeRoute() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Boards</h1>
          <p className="text-sm text-muted-foreground">
            All your boards in one place. Drag tasks by their handle to reorder or move them.
          </p>
        </div>
        <CreateBoardDialog />
      </div>
      <TaskDragAndDrop>
        <BoardsList renderBoardContent={(board) => <BoardTasks board={board} />} />
      </TaskDragAndDrop>
    </div>
  );
}
