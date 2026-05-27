import {
  type PlatformCompany,
  type PlatformDashboardData,
  type PlatformFeatureAccess,
  type PlatformFeatureKey,
  type PlatformSubscriptionStatus,
} from '@/lib/api';

// ── Feature catalog ────────────────────────────────────────────────────────

export const featureLabels: Record<PlatformFeatureKey, string> = {
  inventory: 'Inventory',
  sales: 'Sales',
  purchases: 'Purchases',
  finance: 'Finance',
  payroll: 'Payroll',
  reports: 'Reports',
  projects: 'Projects',
  fixed_assets: 'Fixed assets',
  ai_assistant: 'AI assistant',
  integrations: 'Integrations',
};

export const featureKeys = Object.keys(featureLabels) as PlatformFeatureKey[];

export function emptyFeatureAccess(): PlatformFeatureAccess {
  return featureKeys.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as PlatformFeatureAccess);
}

// ── Plan / status badge styles ─────────────────────────────────────────────

export function planStyles(plan: string): string {
  const known: Record<string, string> = {
    starter:
      'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-200 dark:border-cyan-800',
    professional:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800',
    enterprise:
      'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800',
    core_operations:
      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800',
    business_command:
      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:border-violet-800',
  };
  return (
    known[plan] ||
    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700'
  );
}

export const statusStyles: Record<PlatformSubscriptionStatus, string> = {
  trialing:
    'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-800',
  active:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800',
  past_due:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800',
  suspended:
    'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-200 dark:border-orange-800',
  cancelled:
    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700',
};

// ── Communication templates ────────────────────────────────────────────────

export const messageTemplates = [
  {
    key: 'feature-release',
    label: 'Feature Release',
    subject: 'New features now live on KUBIKA system',
    message:
      'We have released platform improvements that may affect your workspace. Please review your dashboard for the latest updates and feel free to reach out with any questions.',
  },
  {
    key: 'maintenance',
    label: 'Scheduled Maintenance',
    subject: 'Scheduled platform maintenance',
    message:
      'Our platform will undergo scheduled maintenance to improve performance and reliability. We expect brief downtime during the maintenance window. Thank you for your patience.',
  },
  {
    key: 'policy-update',
    label: 'Policy Update',
    subject: 'Important policy update',
    message:
      'We are updating our terms of service and privacy policy to reflect new features and compliance requirements. Please review the changes in your account settings.',
  },
  {
    key: 'payment-notice',
    label: 'Payment Notice',
    subject: 'Subscription payment reminder',
    message:
      'Your subscription payment is coming due. Please arrange payment to keep your access active and avoid any service interruption.',
  },
  {
    key: 'security-alert',
    label: 'Security Alert',
    subject: 'Security best practices reminder',
    message:
      'As part of our ongoing security efforts, we recommend reviewing your account security settings, enabling two-factor authentication, and ensuring your password is strong and unique.',
  },
];

// ── Empty dashboard placeholder ────────────────────────────────────────────

export const emptyDashboard: PlatformDashboardData = {
  stats: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    pastDue: 0,
    upcomingPayments: 0,
    monthlyRecurringRevenue: 0,
  },
  companies: [],
  packageMatrix: [],
};

// ── Pure formatters & math helpers ─────────────────────────────────────────

export function formatDate(value?: string | null) {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function splitPlanList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

export function daysUntil(value?: string | null) {
  if (!value) return null;
  const today = new Date();
  const target = new Date(value);
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export function normalizeCompany(company: PlatformCompany): PlatformCompany {
  const rawFeatureAccess = company.feature_access || {};
  const subscriptionModules = company.subscription_modules || [];
  return {
    ...company,
    approvalStatus: company.approvalStatus || company.status || 'pending',
    subscription_plan: company.subscription_plan || 'starter',
    subscription_status: company.subscription_status || 'active',
    billing_cycle: company.billing_cycle || 'monthly',
    billing_amount: company.billing_amount || 0,
    feature_access: rawFeatureAccess,
    enabledModules: featureKeys.filter((key) => rawFeatureAccess[key]),
    enabledModuleCount: featureKeys.filter((key) => rawFeatureAccess[key]).length,
    subscription_modules: subscriptionModules,
  };
}

export function accentFromTone(tone: string): string {
  if (tone.includes('cyan')) return 'bg-cyan-500';
  if (tone.includes('emerald')) return 'bg-emerald-500';
  if (tone.includes('amber')) return 'bg-amber-500';
  if (tone.includes('rose')) return 'bg-rose-500';
  if (tone.includes('red')) return 'bg-red-500';
  if (tone.includes('sky')) return 'bg-sky-500';
  if (tone.includes('violet')) return 'bg-violet-500';
  if (tone.includes('indigo')) return 'bg-indigo-500';
  if (tone.includes('teal')) return 'bg-teal-500';
  return 'bg-slate-500';
}
