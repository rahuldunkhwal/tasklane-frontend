import { Spinner } from '@/components/ui/spinner';

// Shown while the app is still checking something it needs before showing a page
export function PageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  );
}
