import { CircleAlertIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Red box at the top of a form, for errors that don't belong to one field
// (e.g. "Invalid email or password", or "Can't reach the server")
export function FormErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
