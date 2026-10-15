import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, UserPlusIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Board } from '@/types/api';
import { DeleteBoardDialog } from './delete-board-dialog';
import { RenameBoardDialog } from './rename-board-dialog';
import { ShareBoardDialog } from './share-board-dialog';

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
  const [shareOpen, setShareOpen] = useState(false);
  const isOwner = board.role === 'owner';

  return (
    <section
      aria-label={board.title}
      className="flex w-full shrink-0 flex-col gap-3 rounded-xl border bg-background p-3 md:w-72"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate font-medium" title={board.title}>
            {board.title}
          </h2>
          {/* Shared with me: say so, and whose it is (the server also blocks every change) */}
          {!isOwner && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <EyeIcon className="size-3" />
              View only · shared by {board.ownerName}
            </p>
          )}
        </div>

        {/* Only the owner gets the menu: viewers can't rename, delete or share */}
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${board.title}`}>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setShareOpen(true)}>
                <UserPlusIcon />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
                <PencilIcon />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {children}

      {isOwner && (
        <>
          <ShareBoardDialog board={board} open={shareOpen} onOpenChange={setShareOpen} />
          <RenameBoardDialog board={board} open={renameOpen} onOpenChange={setRenameOpen} />
          <DeleteBoardDialog board={board} open={deleteOpen} onOpenChange={setDeleteOpen} />
        </>
      )}
    </section>
  );
}
