"use client";

import Link from "next/link";
import { ChevronRight, User } from "lucide-react";
import { formatBDT, formatRelativeTime } from "@/lib/formatters";
import type { Customer } from "@/contexts/AppContext";

interface CustomerListProps {
  customers: Customer[];
}

export default function CustomerList({ customers }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <User className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h4 className="font-display font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">কোনো গ্রাহক নেই</h4>
        <p className="text-xs sm:text-sm text-muted-foreground">
          নতুন গ্রাহক যোগ করুন শুরু করতে
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {customers.map((customer) => (
        <Link
          key={customer.id}
          href={`/customers/${customer.id}`}
          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 active:bg-secondary/50 transition-colors"
        >
          {/* Avatar */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="font-display font-semibold text-sm sm:text-base text-primary">
              {customer.name.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm sm:text-base truncate">{customer.name}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {customer.phone}
              {customer.lastTransaction && (
                <span className="hidden sm:inline ml-2">• {formatRelativeTime(customer.lastTransaction)}</span>
              )}
            </p>
          </div>

          {/* Balance */}
          <div className="text-right flex-shrink-0">
            <p className={`font-semibold text-sm sm:text-base bengali-number ${customer.balance > 0 ? 'text-destructive' : customer.balance < 0 ? 'text-success' : 'text-muted-foreground'}`}>
              {formatBDT(Math.abs(customer.balance))}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {customer.balance > 0 ? 'বাকি' : customer.balance < 0 ? 'পাওনা' : 'শূন্য'}
            </p>
          </div>

          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
        </Link>
      ))}
    </div>
  );
}
