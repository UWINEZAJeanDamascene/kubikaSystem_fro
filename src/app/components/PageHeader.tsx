import { type ReactNode } from 'react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: LucideIcon;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  backLabel?: string;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  eyebrow,
  actions,
  backLabel = 'Back',
  onBack,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-5 flex flex-col gap-3 sm:mb-6', className)}>
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-fit -ml-2 gap-2 text-muted-foreground hover:text-foreground sm:ml-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel}</span>
        </Button>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {eyebrow}
            </div>
          )}
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-sm sm:flex">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-normal text-foreground sm:text-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
