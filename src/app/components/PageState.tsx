import { type ReactNode } from 'react';
import { AlertTriangle, Loader2, RefreshCw, type LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { cn } from '@/app/components/ui/utils';

interface LoadingStateProps {
  title?: string;
  description?: string;
  rows?: number;
  className?: string;
}

export function LoadingState({
  title = 'Loading data',
  description = 'Please wait while the latest records are prepared.',
  rows = 4,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6', className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr_0.8fr_0.5fr]">
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: ReactNode;
  icon?: LucideIcon;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'The page could not load. Please try again.',
  icon: Icon = AlertTriangle,
  retryLabel = 'Try again',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-64 flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-12 text-center shadow-sm',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      )}
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry} className="mt-5">
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
