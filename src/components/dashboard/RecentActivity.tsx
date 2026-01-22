"use client";

import { CheckCircle, XCircle, AlertCircle, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBDT, formatRelativeTime, getStatusLabel } from "@/lib/formatters";
import type { BakiEntry, PaymentEntry, EntryStatus } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "baki" | "payment";
  amount: number;
  customerName: string;
  description?: string;
  status: EntryStatus;
  createdAt: Date;
}

interface RecentActivityProps {
  bakiEntries: BakiEntry[];
  payments: PaymentEntry[];
  onConfirm?: (id: string, type: "baki" | "payment") => void;
  onReject?: (id: string, type: "baki" | "payment") => void;
  showActions?: boolean;
}

export default function RecentActivity({ 
  bakiEntries, 
  payments, 
  onConfirm, 
  onReject,
  showActions = false 
}: RecentActivityProps) {
  // Combine and sort transactions
  const transactions: Transaction[] = [
    ...bakiEntries.map(b => ({
      id: String(b.id),
      type: "baki" as const,
      amount: typeof b.amount === 'string' ? parseFloat(b.amount) : b.amount,
      customerName: b.customer?.name || b.customer?.phone || 'গ্রাহক',
      description: b.description,
      status: b.status,
      createdAt: new Date(b.createdAt),
    })),
    ...payments.map(p => ({
      id: String(p.id),
      type: "payment" as const,
      amount: typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount,
      customerName: p.customer?.name || p.customer?.phone || 'গ্রাহক',
      description: undefined,
      status: p.status,
      createdAt: new Date(p.createdAt),
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (transactions.length === 0) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h4 className="font-display font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">কোনো লেনদেন নেই</h4>
        <p className="text-xs sm:text-sm text-muted-foreground">
          নতুন বাকি বা পেমেন্ট যোগ করুন
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {transactions.map((transaction) => (
        <div key={`${transaction.type}-${transaction.id}`} className="p-3 sm:p-4">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Icon */}
            <div className={cn(
              "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
              transaction.type === "baki" 
                ? "bg-destructive/10 text-destructive" 
                : "bg-success/10 text-success"
            )}>
              {transaction.type === "baki" ? (
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                <h4 className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{transaction.customerName}</h4>
                <StatusBadge status={transaction.status} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {transaction.type === "baki" ? "বাকি" : "পেমেন্ট"}
                {transaction.description && ` • ${transaction.description}`}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                {formatRelativeTime(transaction.createdAt)}
              </p>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
              <p className={cn(
                "font-semibold text-sm sm:text-base bengali-number",
                transaction.type === "baki" ? "text-destructive" : "text-success"
              )}>
                {transaction.type === "baki" ? "+" : "-"}{formatBDT(transaction.amount)}
              </p>
            </div>
          </div>

          {/* Actions for pending items */}
          {showActions && transaction.status === "pending" && onConfirm && onReject && (
            <div className="flex gap-2 mt-2.5 sm:mt-3 ml-12 sm:ml-14">
              <Button
                size="sm"
                variant="success"
                onClick={() => onConfirm(transaction.id, transaction.type)}
                className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
              >
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                নিশ্চিত
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(transaction.id, transaction.type)}
                className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
              >
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                বাতিল
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: EntryStatus }) {
  const statusConfig = {
    pending: { className: "status-pending", icon: AlertCircle },
    confirmed: { className: "status-confirmed", icon: CheckCircle },
    rejected: { className: "status-rejected", icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap", config.className)}>
      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
      {getStatusLabel(status)}
    </span>
  );
}
