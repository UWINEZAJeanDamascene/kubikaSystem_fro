import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Plus,
  Package,
  FileText,
  Receipt,
  ShoppingCart,
  ClipboardList,
  Users,
  Building2,
  Truck,
  CreditCard,
  ArrowRightLeft,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
}

interface QuickGroup {
  label: string;
  items: QuickAction[];
}

const GROUPS: QuickGroup[] = [
  {
    label: 'Sales',
    items: [
      { label: 'Invoice', href: '/invoices/new', icon: FileText },
      { label: 'Quotation', href: '/quotations/new', icon: FileText },
      { label: 'Sales Order', href: '/sales-orders/create', icon: ShoppingCart },
      { label: 'Delivery Note', href: '/delivery-notes/new', icon: Truck },
      { label: 'Client', href: '/clients/new', icon: Users },
    ],
  },
  {
    label: 'Purchasing',
    items: [
      { label: 'Purchase Order', href: '/purchase-orders/new', icon: ClipboardList },
      { label: 'Purchase', href: '/purchases/new', icon: ShoppingCart },
      { label: 'GRN', href: '/grn/new', icon: Truck },
      { label: 'Purchase Return', href: '/purchase-returns/new', icon: ArrowRightLeft },
      { label: 'Supplier', href: '/suppliers/new', icon: Building2 },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { label: 'Product', href: '/products/new', icon: Package },
      { label: 'Stock Transfer', href: '/stock-transfers/new', icon: ArrowRightLeft },
      { label: 'Stock Audit', href: '/stock-audits/new', icon: ClipboardList },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Expense', href: '/expenses/new', icon: Receipt },
      { label: 'Receipt (AR)', href: '/ar-receipts', icon: Receipt },
      { label: 'Payment (AP)', href: '/ap-payments', icon: CreditCard },
      { label: 'Journal Entry', href: '/journal', icon: BookOpen },
    ],
  },
];

interface QuickCreateMenuProps {
  compact?: boolean; // icon-only on mobile
}

export function QuickCreateMenu({ compact = false }: QuickCreateMenuProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            compact
              ? 'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md shadow-cyan-500/30 transition hover:brightness-110'
              : 'flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50'
          }
          title="Create new"
          aria-label="Create new"
        >
          <Plus className={compact ? 'h-5 w-5' : 'h-4 w-4'} />
          {!compact && <span>New</span>}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 overflow-hidden rounded-2xl border-slate-200 bg-white/95 p-1 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1626]/95"
      >
        <div className="px-3 pb-2 pt-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            Quick create
          </div>
          <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Jump straight into a new record
          </div>
        </div>

        {GROUPS.map((g, gi) => (
          <div key={g.label}>
            {gi > 0 && <DropdownMenuSeparator className="my-1 bg-slate-200/70 dark:bg-white/10" />}
            <DropdownMenuLabel className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {g.label}
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {g.items.map((it) => {
                const Icon = it.icon;
                return (
                  <DropdownMenuItem
                    key={it.href + it.label}
                    onSelect={(e) => {
                      e.preventDefault();
                      navigate(it.href);
                    }}
                    className="group/qc-item flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 outline-none transition focus:bg-gradient-to-r focus:from-cyan-50 focus:to-emerald-50 focus:text-slate-950 dark:text-slate-200 dark:focus:from-cyan-500/15 dark:focus:to-emerald-500/15 dark:focus:text-white"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200 transition group-focus/qc-item:from-cyan-500 group-focus/qc-item:to-emerald-500 group-focus/qc-item:text-white group-focus/qc-item:ring-cyan-400/40 dark:from-white/[0.06] dark:to-white/[0.02] dark:text-slate-300 dark:ring-white/10">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{it.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default QuickCreateMenu;
