import { type ReactNode } from 'react';
import { Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface EmptyStateProps {
  /** Optional Lucide icon component (rendered ~h-7 w-7 inside a gradient tile). */
  icon?: LucideIcon;
  /** Main heading. */
  title: string;
  /** Sub-text explaining what's missing and why. */
  description?: ReactNode;
  /** Optional CTA buttons / links. */
  action?: ReactNode;
  /** Optional secondary CTA below the primary one. */
  secondaryAction?: ReactNode;
  /** Compact mode (smaller padding, used inside cards). */
  compact?: boolean;
  className?: string;
}

/**
 * Standard empty-state panel used across list pages, dashboards, and dialogs.
 * Matches the app gradient/glass aesthetic (cyan/emerald accents).
 *
 * @example
 * <EmptyState
 *   icon={Package}
 *   title="No products yet"
 *   description="Add your first product to start tracking stock."
 *   action={<Button onClick={...}>Add product</Button>}
 * />
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-white via-cyan-50/30 to-emerald-50/40 text-center dark:border-white/10 dark:from-[#0d1626] dark:via-cyan-950/10 dark:to-emerald-950/10',
        compact ? 'px-6 py-10' : 'px-6 py-16',
        className,
      )}
    >
      {/* Decorative blur blobs to match app aesthetic */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/10" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />

      <div
        className={cn(
          'relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30 ring-1 ring-white/20',
          compact ? 'h-12 w-12' : 'h-16 w-16',
        )}
      >
        <Icon className={compact ? 'h-6 w-6' : 'h-7 w-7'} />
      </div>

      <h3
        className={cn(
          'relative mt-4 font-semibold tracking-tight text-slate-950 dark:text-white',
          compact ? 'text-base' : 'text-lg',
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            'relative mt-1.5 max-w-md text-slate-500 dark:text-slate-400',
            compact ? 'text-xs' : 'text-sm',
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="relative mt-5 flex flex-col items-center gap-2 sm:flex-row">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
