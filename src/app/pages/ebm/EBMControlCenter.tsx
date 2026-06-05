import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Clock,
  ShieldCheck,
  Table2,
  Warehouse,
  DownloadCloud,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { ebmApi, type EBMDeviceStatusResponse } from "@/lib/api";
import { Layout } from "@/app/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

interface QueueCounts {
  pending?: number;
  failed?: number;
  abandoned?: number;
  submitted?: number;
}

export default function EBMControlCenter() {
  const [loading, setLoading] = useState(false);
  const [syncingCodes, setSyncingCodes] = useState(false);
  const [devices, setDevices] = useState<EBMDeviceStatusResponse["data"] | null>(null);
  const [queueCounts, setQueueCounts] = useState<QueueCounts>({});
  const [unmatchedCount, setUnmatchedCount] = useState(0);

  const branchStats = useMemo(() => {
    const total = devices?.branches?.length || 0;
    const initialized = devices?.branches?.filter((b) => b.status === "initialized").length || 0;
    const failed = devices?.branches?.filter((b) => b.status === "failed").length || 0;
    const pending = total - initialized - failed;
    return { total, initialized, failed, pending };
  }, [devices]);

  const queueStats = useMemo(() => {
    return {
      pending: queueCounts.pending || 0,
      failed: queueCounts.failed || 0,
      abandoned: queueCounts.abandoned || 0,
      submitted: queueCounts.submitted || 0,
    };
  }, [queueCounts]);

  const load = async () => {
    setLoading(true);
    try {
      const [devicesRes, queueRes, unmatchedRes] = await Promise.all([
        ebmApi
          .getDevices()
          .catch((error) => {
            console.warn("[EBM Control Center] Devices fetch failed", error?.message || error);
            return null;
          }),
        ebmApi
          .getQueue({ page: 1, pageSize: 5 })
          .catch((error) => {
            console.warn("[EBM Control Center] Queue fetch failed", error?.message || error);
            return null;
          }),
        ebmApi
          .getUnmatchedPurchases({ status: "unmatched", limit: 50 })
          .catch((error) => {
            console.warn("[EBM Control Center] Unmatched purchases fetch failed", error?.message || error);
            return null;
          }),
      ]);

      if (devicesRes?.data) setDevices(devicesRes.data);
      const counts = (queueRes as any)?.data?.counts || (queueRes as any)?.counts || {};
      setQueueCounts(counts as QueueCounts);
      const unmatchedData = (unmatchedRes as any)?.data;
      setUnmatchedCount(Array.isArray(unmatchedData) ? unmatchedData.length : 0);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load EBM control data");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncCodes = async () => {
    setSyncingCodes(true);
    try {
      const preferredBranch = devices?.branches?.find((b) => b.modeMatches) || devices?.branches?.[0];
      const branchId = preferredBranch?.branchId || "00";
      await ebmApi.syncCodes({ branchId });
      toast.success("RRA code data synced");
    } catch (error: any) {
      toast.error(error?.message || "RRA code sync failed");
    } finally {
      setSyncingCodes(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">EBM / VSDC</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">EBM Control Center</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              One place to manage device setup, code sync, registrations, queue health, and imports.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/company-settings">
                <ShieldCheck className="h-4 w-4" /> EBM Settings
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> Devices & Codes
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">Initialize devices and sync RRA code tables</p>
              </div>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
                Mode: {devices?.mode || "—"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex flex-wrap gap-3">
                <Badge className="gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {branchStats.initialized} Initialized
                </Badge>
                <Badge className="gap-1 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                  <Clock className="h-3.5 w-3.5" /> {branchStats.pending} Pending
                </Badge>
                <Badge className="gap-1 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200">
                  <AlertTriangle className="h-3.5 w-3.5" /> {branchStats.failed} Failed
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" className="gap-2">
                  <Link to="/company-settings">
                    <LayoutDashboard className="h-4 w-4" /> Open device setup
                  </Link>
                </Button>
                <Button onClick={handleSyncCodes} disabled={syncingCodes} className="gap-2">
                  {syncingCodes ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Sync codes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Warehouse className="h-5 w-5 text-blue-600" /> Branch & Registration
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">Register branches, users, insurance; monitor compliance</p>
              </div>
              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Branches: {branchStats.total}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" className="gap-2">
                  <Link to="/warehouses">
                    <Table2 className="h-4 w-4" /> Manage branches
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/ebm/compliance">
                    <ShieldCheck className="h-4 w-4" /> Compliance dashboard
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tip: Use branch insurance dialog on Warehouses to keep `/branches/saveBrancheInsurances` compliant.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <RefreshCw className="h-5 w-5 text-amber-600" /> Submission Queue
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">Monitor pending/failed VSDC submissions</p>
              </div>
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                Pending: {queueStats.pending}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">Failed: {queueStats.failed}</Badge>
                <Badge className="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200">Abandoned: {queueStats.abandoned}</Badge>
                <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">Submitted: {queueStats.submitted}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" className="gap-2">
                  <Link to="/ebm/retry-queue">
                    <RefreshCw className="h-4 w-4" /> Retry queue
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/ebm/compliance">
                    <ShieldCheck className="h-4 w-4" /> Alerts & health
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <DownloadCloud className="h-5 w-5 text-blue-600" /> Imports & Purchases
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage imported items and unmatched RRA purchases</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
                  Unmatched purchases: {unmatchedCount}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" className="gap-2">
                  <Link to="/imported-items">
                    <DownloadCloud className="h-4 w-4" /> Imported items
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/ebm/unmatched-purchases">
                    <AlertTriangle className="h-4 w-4" /> Unmatched purchases
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Table2 className="h-5 w-5 text-indigo-600" /> Products & Items
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">Register items and view EBM item status</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" className="gap-2">
                  <Link to="/products">
                    <ArrowRight className="h-4 w-4" /> Open products
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/products?filter=ebm">
                    <ShieldCheck className="h-4 w-4" /> EBM status filter
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Use item class, tax type, insurance flags (isrcAplcbYn) in product forms per §3.3.4.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <LayoutDashboard className="h-5 w-5 text-emerald-600" /> Invoices & Fiscal Proof
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">Check RRA status on invoices and receipts</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" className="gap-2">
                  <Link to="/invoices">
                    <ShieldCheck className="h-4 w-4" /> Invoices (RRA status)
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/purchases">
                    <ShieldCheck className="h-4 w-4" /> Purchases (EBM match)
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Receipt fields: rcptNo, rcptDt, rcptSign, intrlData appear on invoice detail/print after successful VSDC submission.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
