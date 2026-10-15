import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useTaskStats } from '../api/get-task-stats';

// Dashboard summary: total, completed and overdue tasks across the user's own boards.
// It ignores the search/filter bar on purpose: it always summarises everything.
export function TaskStatsCards() {
  const stats = useTaskStats();

  if (stats.isPending) {
    return (
      <div className="grid grid-cols-3 gap-3" aria-busy="true" aria-label="Loading summary">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (stats.isError) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border bg-background p-3 text-sm">
        <span className="text-muted-foreground">Couldn't load the summary.</span>
        <Button size="sm" variant="outline" onClick={() => void stats.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const { total, completed, overdue } = stats.data;
  const percentDone = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section aria-label="Task summary" className="grid grid-cols-3 gap-3">
      <StatCard label="Total tasks" value={total} />
      <StatCard label="Completed" value={completed} note={`${percentDone}% done`} />
      {/* Red only when something actually needs attention */}
      <StatCard label="Overdue" value={overdue} danger={overdue > 0} />
    </section>
  );
}

type StatCardProps = { label: string; value: number; note?: string; danger?: boolean };

function StatCard({ label, value, note, danger = false }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border bg-background p-3 sm:p-4',
        danger && 'border-destructive/40',
      )}
    >
      <span className="text-xs text-muted-foreground sm:text-sm">{label}</span>
      <span className={cn('text-2xl font-semibold tabular-nums', danger && 'text-destructive')}>
        {value}
      </span>
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </div>
  );
}
