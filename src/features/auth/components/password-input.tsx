import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// A password field with an eye button to reveal/hide the text. Spread react-hook-form's
// register() onto it like a normal input — the ref flows through to the real <input>.
export function PasswordInput({ className, ...props }: React.ComponentProps<'input'>) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input type={show ? 'text' : 'password'} className={cn('pr-11', className)} {...props} />
      <button
        type="button"
        onClick={() => setShow((value) => !value)}
        aria-label={show ? 'Hide password' : 'Show password'}
        aria-pressed={show}
        tabIndex={-1}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-ink-muted outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  );
}
