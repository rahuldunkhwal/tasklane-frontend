import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { TasklaneLogo } from '@/components/tasklane-logo';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useMe } from '@/features/auth/api/get-me';
import { useLogout } from '@/features/auth/api/logout';
import { useAcceptInvite } from '@/features/boards/api/accept-invite';
import { useInviteInfo } from '@/features/boards/api/get-invite-info';
import { getApiError, getErrorMessage } from '@/lib/api-client';
import { initialsOf } from '@/lib/initials';

// Public landing page for an invite link: /invite/<token>?email=<invited>
export function InviteRoute() {
  const { token = '' } = useParams();
  const [params] = useSearchParams();
  const info = useInviteInfo(token);
  const me = useMe();
  const accept = useAcceptInvite();
  const logout = useLogout();
  const navigate = useNavigate();

  // An emailed invite is bound to one address (the server says which one). The board-wide link
  // isn't, but may still carry ?email= to pre-fill the sign-up form.
  const invitedEmail = info.data?.invitedEmail ?? params.get('email') ?? '';
  // Logged in with a different account than the invite was sent to: joining would be refused,
  // so say so up front and offer to switch accounts instead of showing a dead "Join" button.
  const wrongAccount = Boolean(
    me.data && info.data?.invitedEmail && me.data.email !== info.data.invitedEmail,
  );

  // Carry the invited email + where to return through the sign-up / log-in forms
  const authSearch = new URLSearchParams();
  if (invitedEmail) authSearch.set('email', invitedEmail);
  authSearch.set('redirect', `/invite/${token}`);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4">
      <TasklaneLogo className="text-[22px] font-bold tracking-tight" />

      <div className="w-full max-w-sm rounded-[28px] border bg-surface p-8 text-center shadow-(--shadow-card)">
        {info.isPending || me.isPending ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : info.isError ? (
          <InviteError error={info.error} onRetry={() => void info.refetch()} />
        ) : (
          <>
            {/* Inviter + invitee avatars, like a hand-off */}
            <div className="flex items-center justify-center gap-2">
              <span className="grid size-11 place-items-center rounded-full bg-brand-tint text-sm font-bold text-brand-strong">
                {initialsOf(info.data.inviterName)}
              </span>
              <span className="grid size-11 place-items-center rounded-full bg-sunken text-sm font-bold text-ink-muted">
                {initialsOf(me.data?.name ?? invitedEmail)}
              </span>
            </div>

            <h1 className="mt-5 text-xl font-bold">
              {info.data.inviterName} shared “{info.data.boardTitle}” with you
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              You'll have view-only access to this board and its tasks.
            </p>
            {info.data.invitedEmail && (
              <p className="mt-1 text-xs text-ink-muted">
                This invite is for <span className="font-medium">{info.data.invitedEmail}</span>.
              </p>
            )}

            {me.data ? (
              wrongAccount ? (
                <div className="mt-6 flex flex-col gap-2">
                  <p className="text-sm text-danger" role="alert">
                    You're logged in as {me.data.email}, so you can't use this invite. Switch to
                    the account it was sent to.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                  >
                    {logout.isPending ? 'Switching…' : 'Switch account'}
                  </Button>
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-2">
                  <Button
                    onClick={() => accept.mutate(token, { onSuccess: () => navigate('/boards') })}
                    disabled={accept.isPending}
                  >
                    {accept.isPending && <Spinner />}
                    {accept.isPending ? 'Joining…' : 'Join board'}
                  </Button>
                  {accept.isError && (
                    <p className="text-sm text-danger" role="alert">
                      {getErrorMessage(accept.error)}
                    </p>
                  )}
                </div>
              )
            ) : (
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild>
                  <Link to={`/signup?${authSearch.toString()}`}>Sign up to join</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={`/login?${authSearch.toString()}`}>Log in</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// A dead link and "the server didn't answer" need different advice: only the first one
// should tell the invitee to ask for a new link. Anything else (API asleep, network blip)
// shows the real reason and lets them simply try again.
function InviteError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  if (getApiError(error)?.code === 'INVALID_INVITE') {
    return (
      <>
        <h1 className="text-xl font-bold">This invite link doesn't work</h1>
        <p className="mt-2 text-sm text-ink-muted">
          It may have been used already, withdrawn, or the link is incomplete. Ask the person to
          share it again.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/">Go to Tasklane</Link>
        </Button>
      </>
    );
  }
  return (
    <>
      <h1 className="text-xl font-bold">Couldn't load this invite</h1>
      <p className="mt-2 text-sm text-ink-muted">{getErrorMessage(error)}</p>
      <Button className="mt-6" onClick={onRetry}>
        Try again
      </Button>
    </>
  );
}
