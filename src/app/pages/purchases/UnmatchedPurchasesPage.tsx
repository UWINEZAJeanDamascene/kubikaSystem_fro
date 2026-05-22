import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Layout } from "@/app/layout/Layout";
import { ebmApi } from "@/lib/api";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { toast } from "sonner";

interface UnmatchedPurchase {
  _id: string;
  supplierTin?: string;
  supplierName?: string;
  sellerInvoiceNo?: string;
  invoiceDate?: string;
  totalAmount?: number;
  taxAmount?: number;
  status?: string;
  pulledAt?: string;
}

export default function UnmatchedPurchasesPage() {
  const [items, setItems] = useState<UnmatchedPurchase[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await ebmApi.getUnmatchedPurchases({ status: "unmatched", limit: 200 });
      setItems((res.data || []) as UnmatchedPurchase[]);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load unmatched EBM purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sync = async () => {
    setLoading(true);
    try {
      await ebmApi.syncPurchases({ branchId: "00" });
      toast.success("Purchase pull completed");
      await load();
    } catch (error: any) {
      toast.error(error?.message || "Purchase pull failed");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Unmatched EBM Purchases</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">RRA purchase records that could not be linked automatically.</p>
            </div>
            <Button onClick={sync} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Pull from RRA
            </Button>
          </div>

          <Card className="dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>TIN</TableHead>
                    <TableHead>Seller Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">VAT</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.supplierName || "-"}</TableCell>
                      <TableCell className="font-mono text-xs">{item.supplierTin || "-"}</TableCell>
                      <TableCell>{item.sellerInvoiceNo || "-"}</TableCell>
                      <TableCell>{item.invoiceDate ? new Date(item.invoiceDate).toLocaleDateString() : "-"}</TableCell>
                      <TableCell className="text-right">{(item.taxAmount || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{(item.totalAmount || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {!items.length && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        {loading ? "Loading..." : "No unmatched RRA purchase records"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
