import { Button } from '@/components/ui/button';

type PageErrorProps = {
  message: string;
  onRetry: () => void;
};

// Shown when a whole page can't load (e.g. the server is down), with a way to try again
export function PageError({ message, onRetry }: PageErrorProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}
