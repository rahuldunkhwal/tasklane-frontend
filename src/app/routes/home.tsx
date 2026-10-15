import { BoardsList } from '@/features/boards/components/boards-list';
import { CreateBoardDialog } from '@/features/boards/components/create-board-dialog';
import { BoardTasks } from '@/features/tasks/components/board-tasks';

// Home is where features are combined: boards, with each board's tasks inside.
// (Search, filters and the dashboard join in later phases.)
export function HomeRoute() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Boards</h1>
          <p className="text-sm text-muted-foreground">All your boards in one place.</p>
        </div>
        <CreateBoardDialog />
      </div>
      <BoardsList renderBoardContent={(board) => <BoardTasks board={board} />} />
    </div>
  );
}
