import { initialsOf } from '@/lib/initials';
import { cn } from '@/lib/utils';

// Shows the user's photo if they have one, otherwise their initials on a lime chip.
// Size/text come from `className` (e.g. "size-8 text-sm"), so one component fits the navbar,
// the profile page, and anywhere else.
export function UserAvatar({
  name,
  avatarUrl,
  className,
}: {
  name?: string;
  avatarUrl?: string | null;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        aria-hidden
        className={cn('shrink-0 rounded-full object-cover', className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-brand-tint font-bold text-brand-strong',
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
