import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Board } from '@/types/api';
import { DeleteBoardDialog } from './delete-board-dialog';
import { RenameBoardDialog } from './rename-board-dialog';

type BoardColumnProps = {
  board: Board;
  // What goes inside the column (the tasks). The boards feature doesn't know about tasks:
  // the page that uses both (Home) fills this slot.
  children?: ReactNode;
};

// One board shown as a column (like Trello)
export function BoardColumn({ board, children }: BoardColumnProps) {
  // Which dialog is open. The dialogs sit OUTSIDE the menu: the menu closes when an item is
  // chosen, and a dialog inside it would close with it.
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <section
      aria-label={board.title}
      className="flex w-full shrink-0 flex-col gap-3 rounded-xl border bg-background p-3 md:w-72"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="truncate font-medium" title={board.title}>
          {board.title}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${board.title}`}>
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
              <PencilIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {children}

      <RenameBoardDialog board={board} open={renameOpen} onOpenChange={setRenameOpen} />
      <DeleteBoardDialog board={board} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </section>
  );
}
