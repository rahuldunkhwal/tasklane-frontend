import { LayoutGridIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getErrorMessage } from '@/lib/api-client';
import type { Board } from '@/types/api';
import { useBoards } from '../api/get-boards';
import { BoardColumn } from './board-column';
import { CreateBoardDialog } from './create-board-dialog';

// Phones: boards stacked top to bottom. Tablets and up (md:): side by side, scrolling sideways.
const columnsLayout = 'flex flex-col gap-4 md:flex-row md:items-start md:overflow-x-auto md:pb-4';

type BoardsListProps = {
  // What to show inside each board column. Passed in by the page (Home puts the tasks there),
  // so the boards feature never has to import the tasks feature.
  renderBoardContent?: (board: Board) => ReactNode;
};

export function BoardsList({ renderBoardContent }: BoardsListProps) {
  const boards = useBoards();

  // 1. Loading: grey shapes where the columns will appear (feels faster than a spinner)
  if (boards.isPending) {
    return (
      <div className={columnsLayout} aria-busy="true" aria-label="Loading boards">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-32 w-full shrink-0 rounded-xl md:w-72" />
        ))}
      </div>
    );
  }

  // 2. Error: say what happened and offer a retry
  if (boards.isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-background p-8 text-center">
        <p className="text-sm text-muted-foreground">{getErrorMessage(boards.error)}</p>
        <Button variant="outline" onClick={() => void boards.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  // 3. Empty: explain what to do next instead of showing nothing
  if (boards.data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-background p-10 text-center">
        <LayoutGridIcon className="size-8 text-muted-foreground" />
        <p className="font-medium">No boards yet</p>
        <p className="mb-2 text-sm text-muted-foreground">
          Create your first board to start organising tasks.
        </p>
        <CreateBoardDialog />
      </div>
    );
  }

  // 4. The boards
  return (
    <div className={columnsLayout}>
      {boards.data.map((board) => (
        <BoardColumn key={board.id} board={board}>
          {renderBoardContent?.(board)}
        </BoardColumn>
      ))}
    </div>
  );
}
