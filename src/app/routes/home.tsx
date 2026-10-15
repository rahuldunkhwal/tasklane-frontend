import { BoardsList } from '@/features/boards/components/boards-list';
import { CreateBoardDialog } from '@/features/boards/components/create-board-dialog';

// Home combines features: boards now; tasks, search and the dashboard in later phases
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
      <BoardsList />
    </div>
  );
}
