import { Outlet } from 'react-router';
import { TasklaneLogo } from '@/components/tasklane-logo';

// Shared frame for the auth pages (login, signup, forgot, reset). The form sits on the left
// exactly as before; on wide screens a brand panel fills the right half so the page isn't empty.
// The panel is hidden below `lg`, where it's just the centred form (unchanged).
export function AuthLayout() {
  return (
    <main className="min-h-svh md:grid md:min-h-svh md:grid-cols-[minmax(360px,40%)_1fr]">
      {/* Left: the form (its content is unchanged) */}
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4 md:min-h-0">
        <TasklaneLogo className="text-[22px] font-bold tracking-tight" />
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>

      {/* Right: on-brand panel, shown from tablet width up */}
      <aside className="relative hidden overflow-hidden bg-ink md:flex md:flex-col md:justify-center md:gap-10 md:p-10 lg:gap-12 lg:p-14">
        {/* Soft lime glows (decorative) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-brand/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-brand/10 blur-3xl"
        />

        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] text-surface lg:text-5xl">
            Everything in its lane.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-surface/70 lg:text-lg">
            Organise work into boards, drag tasks where they belong, and share a board with your
            team in a click.
          </p>
        </div>

        <MiniBoard />
      </aside>
    </main>
  );
}

// A small, decorative kanban illustration that echoes the product (pure CSS, no image asset).
function MiniBoard() {
  const columns = [
    { title: 14, cards: [{ chip: 'brand' as const }, {}, {}] },
    { title: 10, cards: [{}, { chip: 'warn' as const }] },
    { title: 12, cards: [{ chip: 'done' as const }, {}] },
  ];
  return (
    <div
      aria-hidden
      className="relative flex -rotate-3 gap-3 mask-[linear-gradient(to_bottom,black,transparent)]"
    >
      {columns.map((col, i) => (
        <div key={i} className="w-32 rounded-2xl bg-surface/5 p-2.5 ring-1 ring-surface/10">
          <div className="mb-2.5 h-2 rounded-full bg-surface/25" style={{ width: col.title * 4 }} />
          <div className="flex flex-col gap-2">
            {col.cards.map((card, j) => (
              <div key={j} className="rounded-lg bg-surface p-2.5">
                <div className="h-1.5 w-11 rounded-full bg-ink/20" />
                {'chip' in card && card.chip && (
                  <div
                    className={`mt-2 h-2.5 w-7 rounded-full ${
                      card.chip === 'brand'
                        ? 'bg-brand'
                        : card.chip === 'warn'
                          ? 'bg-warning-tint'
                          : 'bg-brand-tint'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
