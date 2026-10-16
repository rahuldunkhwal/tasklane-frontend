import { BoardsWorkspace } from '@/app/components/boards-workspace';
import { appContainer, pageTitle } from '@/app/layouts/app-layout';
import { useBoards } from '@/features/boards/api/get-boards';
import { CreateBoardDialog } from '@/features/boards/components/create-board-dialog';
import { TaskDragAndDrop } from '@/features/tasks/components/task-drag-and-drop';
import { TaskFiltersBar } from '@/features/tasks/components/task-filters-bar';

// The Boards page (/boards): fills the screen below the navbar — the header stays put while the
// lanes scroll sideways and each lane scrolls inside itself, so the page itself never scrolls.
export function BoardsRoute() {
  const boards = useBoards();

  return (
    <div className="flex h-[calc(100dvh-3.5rem-68px)] flex-col overflow-hidden sm:h-[calc(100dvh-4rem)]">
      <div className={`${appContainer} flex shrink-0 flex-col gap-5 pt-5 sm:pt-6`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <h1 className={pageTitle}>Boards</h1>
              {boards.data && boards.data.length > 0 && (
                <span className="rounded-full bg-sunken px-2 py-0.5 text-sm font-medium text-ink-muted">
                  {boards.data.length}
                </span>
              )}
            </div>
            {/* On phones the New board button rides in the title row; filters go on the row below */}
            <div className="sm:hidden">
              <CreateBoardDialog />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <TaskFiltersBar />
            <div className="hidden sm:block">
              <CreateBoardDialog />
            </div>
          </div>
        </div>
      </div>

      <TaskDragAndDrop>
        <BoardsWorkspace />
      </TaskDragAndDrop>
    </div>
  );
}
