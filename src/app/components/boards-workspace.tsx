import { LayoutGridIcon } from 'lucide-react';
import { appContainer } from '@/app/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBoards } from '@/features/boards/api/get-boards';
import { BoardColumn } from '@/features/boards/components/board-column';
import { CreateBoardDialog } from '@/features/boards/components/create-board-dialog';
import { useTasks } from '@/features/tasks/api/get-tasks';
import { BoardTasks } from '@/features/tasks/components/board-tasks';
import { useTaskFilters } from '@/features/tasks/filters';
import { getErrorMessage } from '@/lib/api-client';

// The horizontally-scrolling lanes. Lives in the app layer because it combines the boards
// feature (lanes) with the tasks feature (task counts + lane contents).
export function BoardsWorkspace() {
  const boards = useBoards();
  const { filters } = useTaskFilters();
  const tasks = useTasks(filters); // same key as the lanes → one shared request

  const countOf = (boardId: string) =>
    tasks.data ? tasks.data.filter((task) => task.boardId === boardId).length : undefined;

  if (boards.isPending) {
    return (
      <div className={`${appContainer} flex gap-4 pt-4`} aria-busy="true" aria-label="Loading boards">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-64 w-72 shrink-0 rounded-[28px]" />
        ))}
      </div>
    );
  }

  if (boards.isError) {
    return (
      <div className={`${appContainer} pt-6`}>
        <div className="flex flex-col items-center gap-3 rounded-[28px] border bg-surface p-8 text-center">
          <p className="text-sm text-ink-muted">{getErrorMessage(boards.error)}</p>
          <Button variant="outline" onClick={() => void boards.refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (boards.data.length === 0) {
    return (
      <div className={`${appContainer} pt-6`}>
        <div className="flex flex-col items-center gap-2 rounded-[28px] border border-dashed bg-surface p-10 text-center">
          <LayoutGridIcon className="size-8 text-ink-muted" />
          <p className="font-semibold">No boards yet</p>
          <p className="mb-2 text-sm text-ink-muted">
            Create your first board to start organising tasks.
          </p>
          <CreateBoardDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-6 min-h-0 flex-1">
      {/* Full-width, scrolls sideways; the first lane lines up with the page container */}
      <div
        className="flex h-full items-start gap-5 overflow-x-auto overflow-y-hidden pb-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/25 [&::-webkit-scrollbar]:h-1.5"
        style={{
          paddingLeft: 'max(1rem, calc((100% - 1280px) / 2 + 24px))',
          paddingRight: '1.5rem',
        }}
      >
        {boards.data.map((board) => (
          <BoardColumn key={board.id} board={board} count={countOf(board.id)}>
            <BoardTasks board={board} />
          </BoardColumn>
        ))}
      </div>
      {/* Right edge fade hints there are more boards to the right */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[120px] bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
