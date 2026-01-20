"use client";

import { useState } from "react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import BottomNav from "@/components/shared/BottomNav";
import RoleSwitcher from "@/components/shared/RoleSwitcher";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useApp } from "@/contexts/AppContext";
import { formatBDT, getStatusLabel } from "@/lib/formatters";
import { FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EntryStatus } from "@/contexts/AppContext";

type FilterStatus = "all" | EntryStatus;

export default function LedgerPage() {
  const { bakiEntries, payments, customers, currentRole } = useApp();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  // Filter entries based on status
  const filteredBaki = statusFilter === "all" 
    ? bakiEntries 
    : bakiEntries.filter(b => b.status === statusFilter);
  
  const filteredPayments = statusFilter === "all"
    ? payments
    : payments.filter(p => p.status === statusFilter);

  // Calculate summary
  const totalBaki = bakiEntries
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + b.amount, 0);
  
  const totalPayments = payments
    .filter(p => p.status === "confirmed")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const runningBalance = totalBaki - totalPayments;

  const filterButtons: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "সব" },
    { value: "pending", label: "পেন্ডিং" },
    { value: "confirmed", label: "নিশ্চিত" },
    { value: "rejected", label: "বাতিল" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      <RoleSwitcher />
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">লেজার</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">সম্পূর্ণ লেনদেনের ইতিহাস</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-3 sm:p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">মোট বাকি</p>
            <p className="font-display text-sm sm:text-lg font-bold text-destructive bengali-number truncate">
              {formatBDT(totalBaki)}
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-success/10 border border-success/20">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">মোট পেমেন্ট</p>
            <p className="font-display text-sm sm:text-lg font-bold text-success bengali-number truncate">
              {formatBDT(totalPayments)}
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">ব্যালেন্স</p>
            <p className={`font-display text-sm sm:text-lg font-bold bengali-number truncate ${
              runningBalance > 0 ? 'text-destructive' : 'text-success'
            }`}>
              {formatBDT(Math.abs(runningBalance))}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {filterButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={statusFilter === btn.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(btn.value)}
              className="flex-shrink-0 text-xs sm:text-sm h-8 sm:h-9 px-2.5 sm:px-3"
            >
              {btn.label}
            </Button>
          ))}
        </div>

        {/* Ledger Entries */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-auto p-1">
              <TabsTrigger value="all" className="py-2.5 sm:py-3 text-xs sm:text-sm">সব</TabsTrigger>
              <TabsTrigger value="baki" className="py-2.5 sm:py-3 text-xs sm:text-sm">বাকি</TabsTrigger>
              <TabsTrigger value="payment" className="py-2.5 sm:py-3 text-xs sm:text-sm">পেমেন্ট</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <RecentActivity bakiEntries={filteredBaki} payments={filteredPayments} />
            </TabsContent>

            <TabsContent value="baki" className="mt-0">
              <RecentActivity bakiEntries={filteredBaki} payments={[]} />
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              <RecentActivity bakiEntries={[]} payments={filteredPayments} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Empty state */}
        {filteredBaki.length === 0 && filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-display font-semibold mb-2">কোনো এন্ট্রি নেই</h4>
            <p className="text-sm text-muted-foreground">
              {statusFilter === "all" 
                ? "নতুন বাকি বা পেমেন্ট যোগ করুন" 
                : `${getStatusLabel(statusFilter)} স্ট্যাটাসের কোনো এন্ট্রি নেই`}
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
