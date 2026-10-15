// The Tasklane word-mark: "Task" + "lane" inside a lime pill. Used in the navbar and on the auth pages.
export function TasklaneLogo({ className }: { className?: string }) {
  return (
    <span className={className ?? 'text-xl font-bold tracking-tight'}>
      Task<span className="rounded-full bg-brand px-2.5 py-0.5 text-on-brand">lane</span>
    </span>
  );
}
