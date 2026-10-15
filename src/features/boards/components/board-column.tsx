import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, UserPlusIcon } from 'lucide-react';
import { forwardRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Board } from '@/types/api';
import { DeleteBoardDialog } from './delete-board-dialog';
import { RenameBoardDialog } from './rename-board-dialog';
import { ShareBoardDialog } from './share-board-dialog';

type BoardColumnProps = {
  board: Board;
  count?: number; // how many tasks are shown in this lane (filled by the page, which has the tasks)
  highlighted?: boolean; // briefly outlined after its strip pill is clicked
  // What goes inside the column (the tasks). The boards feature doesn't know about tasks:
  // the page that uses both (Home) fills this slot.
  children?: ReactNode;
};

// One board shown as a full-height lane (like Trello): header and footer stay put, tasks scroll.
export const BoardColumn = forwardRef<HTMLElement, BoardColumnProps>(function BoardColumn(
  { board, count, highlighted = false, children },
  ref,
) {
  // Which dialog is open. The dialogs sit OUTSIDE the menu: the menu closes when an item is
  // chosen, and a dialog inside it would close with it.
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const isOwner = board.role === 'owner';

  return (
    <section
      ref={ref}
      aria-label={board.title}
      className={cn(
        'flex max-h-full w-72 flex-none flex-col gap-2 rounded-[28px] bg-sunken p-3 transition-shadow',
        highlighted && 'outline-2 outline-brand-line',
      )}
    >
      <div className="flex shrink-0 items-start justify-between gap-2 px-1">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-[15px] font-semibold" title={board.title}>
            {board.title}
          </h2>
          {count !== undefined && <span className="text-xs text-ink-muted">{count}</span>}
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

      {/* Shared with me: say so, and whose it is (the server also blocks every change) */}
      {!isOwner && (
        <p className="flex shrink-0 items-center gap-1 px-1 text-xs text-ink-muted">
          <EyeIcon className="size-3" />
          View only · shared by {board.ownerName}
        </p>
      )}

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
});
