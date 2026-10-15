import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBoards } from '@/features/boards/api/get-boards';
import { CreateBoardDialog } from '@/features/boards/components/create-board-dialog';
import { useTasks } from '@/features/tasks/api/get-tasks';
import { useTaskStats } from '@/features/tasks/api/get-task-stats';
import { isOverdue } from '@/features/tasks/utils';
import { cn } from '@/lib/utils';
import type { Board, Task } from '@/types/api';

// The Home landing: a headline overview (numbers from the server, own boards only) plus a visual
// grid of your boards to jump into. No logic/data changes — it reads the same caches.
export function DashboardRoute() {
  const stats = useTaskStats();
  const boards = useBoards();
  const tasks = useTasks(); // no filters → all visible tasks

  return (
    <div className="mx-auto w-full max-w-[1040px] px-4 pt-6 pb-10 sm:px-6 sm:pt-10">
      <h1 className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em]">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Your task overview across the boards you own.</p>

      {stats.isError ? (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-[28px] border bg-surface p-6 text-sm">
          <span className="text-ink-muted">Couldn't load your overview.</span>
          <Button size="sm" variant="outline" onClick={() => void stats.refetch()}>
            Try again
          </Button>
        </div>
      ) : stats.isPending ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-32 rounded-[28px]" />
          ))}
        </div>
      ) : (
        <Overview
          total={stats.data.total}
          completed={stats.data.completed}
          overdue={stats.data.overdue}
        />
      )}

      <YourBoards
        boards={boards.data?.filter((board) => board.role === 'owner') ?? []}
        tasks={tasks.data ?? []}
        loading={boards.isPending || tasks.isPending}
      />
    </div>
  );
}

function Overview({ total, completed, overdue }: { total: number; completed: number; overdue: number }) {
  const percentDone = total === 0 ? 0 : Math.round((completed / total) * 100);
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100);
  const openNonOverdue = Math.max(0, total - completed - overdue);

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="Total tasks" value={total} />
        <Tile label="Completed" value={completed} tone="brand" />
        <Tile label="Overdue" value={overdue} tone={overdue > 0 ? 'danger' : undefined} />
      </div>

      <div className="rounded-[28px] border bg-surface p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-semibold">Progress</span>
          <span className="font-mono text-sm tabular-nums text-ink-muted">{percentDone}%</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-sunken">
          <div className="bg-brand-line" style={{ width: `${pct(completed)}%` }} />
          <div className="bg-border-strong" style={{ width: `${pct(openNonOverdue)}%` }} />
          <div
            style={{
              width: `${pct(overdue)}%`,
              backgroundImage:
                'repeating-linear-gradient(135deg, var(--danger) 0 2px, var(--sunken) 2px 5px)',
            }}
          />
        </div>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs tabular-nums text-ink-muted">
          <span>{completed} done</span>
          <span>{Math.max(0, total - completed)} open</span>
          <span className={cn(overdue > 0 && 'text-danger')}>{overdue} overdue</span>
        </p>
      </div>
    </div>
  );
}

function Tile({ label, value, tone }: { label: string; value: number; tone?: 'brand' | 'danger' }) {
  return (
    <div className={cn('rounded-[28px] border bg-surface p-6', tone === 'danger' && 'border-danger/30')}>
      <p className={cn('text-sm text-ink-muted', tone === 'danger' && 'text-danger')}>{label}</p>
      <p
        className={cn(
          'mt-2 font-mono text-5xl font-medium tracking-[-0.04em] tabular-nums',
          tone === 'brand' && 'text-brand-strong',
          tone === 'danger' && 'text-danger',
        )}
      >
        {value}
      </p>
    </div>
  );
}

// Listed statically so Tailwind generates each class; a board gets one by a hash of its id.
const BOARD_COLORS = ['bg-board-1', 'bg-board-2', 'bg-board-3', 'bg-board-4', 'bg-board-5', 'bg-board-6'];
const coverFor = (id: string) =>
  BOARD_COLORS[[...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % BOARD_COLORS.length];

function YourBoards({ boards, tasks, loading }: { boards: Board[]; tasks: Task[]; loading: boolean }) {
  const gridClass = 'mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold">Your boards</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {boards.length === 0
          ? 'Create your first board to start organising tasks.'
          : 'Jump into a board, or create a new one.'}
      </p>

      {loading ? (
        <div className={gridClass}>
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-[104px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className={gridClass}>
          {boards.map((board) => {
            const own = tasks.filter((task) => task.boardId === board.id);
            const overdue = own.filter((task) => isOverdue(task)).length;
            return (
              <Link
                key={board.id}
                to="/boards"
                className="group overflow-hidden rounded-2xl border bg-surface transition-colors hover:border-border-strong"
              >
                <div className={cn('h-14', coverFor(board.id))} />
                <div className="p-3">
                  <p className="truncate font-semibold" title={board.title}>
                    {board.title}
                  </p>
                  <p className="mt-0.5 font-mono text-xs tabular-nums text-ink-muted">
                    {own.length} {own.length === 1 ? 'task' : 'tasks'}
                    {overdue > 0 && <span className="text-danger"> · {overdue} overdue</span>}
                  </p>
                </div>
              </Link>
            );
          })}

          <CreateBoardDialog
            trigger={
              <button
                type="button"
                className="flex min-h-[104px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border-strong/60 text-sm font-semibold text-ink-muted transition-colors outline-none hover:bg-sunken/60 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <PlusIcon className="size-5" />
                Create new board
              </button>
            }
          />
        </div>
      )}
    </section>
  );
}
