import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';
import { formatMoney, titleCase } from '../lib';

export interface AnalyticsData {
  mrr: number;
  mrrByPlan: Record<string, number>;
  totalTenants: number;
  activeTenants: number;
  planDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  growthTrend: Array<{ month: string; count: number }>;
  churnTrend: Array<{ month: string; count: number }>;
  activeTenantTrend: Array<{ month: string; count: number }>;
}

interface AnalyticsTabProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

export default function AnalyticsTab({ analytics, loading }: AnalyticsTabProps) {
  if (loading || !analytics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-xl" />
        ))}
      </div>
    );
  }

  const churnRate = analytics.totalTenants
    ? Math.round((analytics.churnTrend.reduce((s, d) => s + d.count, 0) / analytics.totalTenants) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-cyan-500" />
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">MRR</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 tabular-nums dark:text-white">
              {formatMoney(analytics.mrr)}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-emerald-500" />
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Tenants
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 tabular-nums dark:text-white">
              {analytics.totalTenants}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-amber-500" />
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Tenants
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 tabular-nums dark:text-white">
              {analytics.activeTenants}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-rose-500" />
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Churn Rate
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 tabular-nums dark:text-white">
              {churnRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-sky-500" />
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-950 dark:text-white">
              Growth Trend (New Signups)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.growthTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'New signups', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-red-500" />
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-950 dark:text-white">Churn Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.churnTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Churned tenants', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-emerald-500" />
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-950 dark:text-white">
              Active Tenant Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.activeTenantTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Active tenants', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-violet-500" />
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-950 dark:text-white">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(analytics.planDistribution).map(([name, value]) => ({
                    name: titleCase(name),
                    value,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {Object.entries(analytics.planDistribution).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-indigo-500" />
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-950 dark:text-white">MRR by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={Object.entries(analytics.mrrByPlan).map(([plan, value]) => ({
                  plan: titleCase(plan),
                  value: Math.round((value || 0) * 100) / 100,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="plan"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Plan', position: 'insideBottom', offset: -2, fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: 'MRR ($)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip formatter={(value: number) => formatMoney(value)} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900/70">
          <div className="h-1 bg-teal-500" />
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-950 dark:text-white">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(analytics.statusDistribution).map(([name, value]) => ({
                    name: titleCase(name),
                    value,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {Object.entries(analytics.statusDistribution).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#10b981', '#f59e0b', '#ef4444', '#64748b', '#8b5cf6'][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
