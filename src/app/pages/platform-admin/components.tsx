import { type ReactNode } from 'react';
import { type PlatformCompany } from '@/lib/api';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Building2, CalendarClock, KeyRound, Mail, Users } from 'lucide-react';
import {
  accentFromTone,
  daysUntil,
  featureKeys,
  formatMoney,
  percent,
  planStyles,
  statusStyles,
  titleCase,
} from './lib';

// ── StatTile ──────────────────────────────────────────────────────────────

export function StatTile({
  title,
  value,
  detail,
  icon,
  tone,
  barValue,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  tone: string;
  barValue?: number;
}) {
  return (
    <Card className="group overflow-hidden border-0 bg-white shadow-sm transition-all hover:shadow-md dark:bg-slate-900/70">
      <div className={`h-1 w-full ${accentFromTone(tone)}`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 tabular-nums dark:text-white">
              {value}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
          </div>
          <div
            className={`rounded-xl p-2.5 shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-105 ${tone}`}
          >
            {icon}
          </div>
        </div>
        {typeof barValue === 'number' && (
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${accentFromTone(tone)}`}
              style={{ width: `${barValue}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── OpsMetric ─────────────────────────────────────────────────────────────

export function OpsMetric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-white/60">{label}</p>
        <span className="rounded-lg bg-white/10 p-2 text-cyan-100 ring-1 ring-white/10">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-white/50">{detail}</p>
    </div>
  );
}

// ── SignalBar ─────────────────────────────────────────────────────────────

export function SignalBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${tone}`} />
          <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
        </div>
        <span className="font-semibold text-slate-900 dark:text-white">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ── WorkstreamCard ────────────────────────────────────────────────────────

export function WorkstreamCard({
  title,
  value,
  detail,
  icon,
  tone,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <div className="group rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700">
      <div className="flex items-start gap-4">
        <div
          className={`rounded-xl p-2.5 shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-105 ${tone}`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 tabular-nums dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
      </div>
    </div>
  );
}

// ── EmptyPanel ────────────────────────────────────────────────────────────

export function EmptyPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
      <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
        <Building2 className="h-8 w-8 text-slate-400" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
      <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

// ── CompanySummary ────────────────────────────────────────────────────────

export function CompanySummary({ company }: { company: PlatformCompany }) {
  const billingDelta = daysUntil(company.next_billing_date);
  const accessDepth = percent(company.enabledModuleCount, featureKeys.length);
  const needsAttention =
    company.subscription_status === 'past_due' || company.subscription_status === 'suspended';
  const lifecycleTone =
    company.approvalStatus === 'approved'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
      : company.approvalStatus === 'rejected'
        ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800'
        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800';

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="truncate text-base font-semibold text-slate-950 dark:text-white">
          {company.name}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={`rounded-md text-xs font-medium ${lifecycleTone}`}>
            {titleCase(company.approvalStatus)}
          </Badge>
          <Badge
            variant="outline"
            className={`rounded-md text-xs font-medium ${planStyles(company.subscription_plan)}`}
          >
            {titleCase(company.subscription_plan)}
          </Badge>
          <Badge
            variant="outline"
            className={`rounded-md text-xs font-medium ${statusStyles[company.subscription_status]}`}
          >
            {titleCase(company.subscription_status)}
          </Badge>
        </div>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-2 xl:grid-cols-4">
        <span className="flex min-w-0 items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{company.email}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          {company.activeUsers || 0}/{company.users || 0} active
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
          {billingDelta === null
            ? 'Not scheduled'
            : billingDelta < 0
              ? `${Math.abs(billingDelta)} days overdue`
              : `Bills in ${billingDelta} days`}
        </span>
        <span className="flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5 text-slate-400" />
          {accessDepth}% module coverage
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full ${
              needsAttention
                ? 'bg-gradient-to-r from-red-500 to-amber-400'
                : 'bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-400'
            }`}
            style={{ width: `${accessDepth}%` }}
          />
        </div>
        <p className="shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {formatMoney(company.billing_amount)} / {titleCase(company.billing_cycle)}
        </p>
      </div>
    </div>
  );
}
