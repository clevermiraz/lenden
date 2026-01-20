"use client";

import DashboardHeader from "@/components/shared/DashboardHeader";
import BottomNav from "@/components/shared/BottomNav";
import RoleSwitcher from "@/components/shared/RoleSwitcher";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useApp } from "@/contexts/AppContext";
import { formatBDT } from "@/lib/formatters";
import { Store, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CustomerDashboard() {
  const { 
    bakiEntries, 
    payments, 
    customers,
    confirmBaki,
    rejectBaki,
    confirmPayment,
    rejectPayment,
  } = useApp();

  // For demo, show all data as if customer is connected to the shop
  // Filter to pending items
  const pendingBaki = bakiEntries.filter(b => b.status === 'pending');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const pendingCount = pendingBaki.length + pendingPayments.length;

  // Calculate total due (simulated for customer view)
  const totalDue = customers.reduce((sum, c) => sum + c.balance, 0);

  const handleConfirm = (id: string, type: "baki" | "payment") => {
    if (type === "baki") {
      confirmBaki(id);
      toast.success("বাকি নিশ্চিত হয়েছে!");
    } else {
      confirmPayment(id);
      toast.success("পেমেন্ট নিশ্চিত হয়েছে!");
    }
  };

  const handleReject = (id: string, type: "baki" | "payment") => {
    if (type === "baki") {
      rejectBaki(id);
      toast.error("বাকি বাতিল হয়েছে");
    } else {
      rejectPayment(id);
      toast.error("পেমেন্ট বাতিল হয়েছে");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      <RoleSwitcher />
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Total Balance Card */}
        <div className="relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl gradient-hero text-primary-foreground shadow-elevated overflow-hidden">
          <div className="hidden sm:block absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="min-w-0 flex-1">
                <p className="text-primary-foreground/80 text-xs sm:text-sm mb-0.5 sm:mb-1">আপনার মোট বাকি</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold bengali-number truncate">
                  {formatBDT(totalDue)}
                </h2>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ml-3">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-primary-foreground/70">
              রহিম স্টোর এ
            </p>
          </div>
        </div>

        {/* Pending Confirmations */}
        {pendingCount > 0 && (
          <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border bg-pending/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-pending/15 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-pending" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-sm sm:text-base">নিশ্চিতকরণ প্রয়োজন</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{pendingCount} টি এন্ট্রি পেন্ডিং</p>
                </div>
              </div>
            </div>

            <RecentActivity
              bakiEntries={pendingBaki}
              payments={pendingPayments}
              onConfirm={handleConfirm}
              onReject={handleReject}
              showActions={true}
            />
          </div>
        )}

        {/* Shop Info */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Store className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-sm sm:text-base">রহিম স্টোর</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">মিরপুর, ঢাকা</p>
              <p className="text-xs sm:text-sm text-muted-foreground">০১৭১২-৩৪৫৬৭৮</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 text-success text-xs sm:text-sm">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>সংযুক্ত</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-border">
            <h3 className="font-display font-semibold text-sm sm:text-base">সাম্প্রতিক লেনদেন</h3>
          </div>
          <RecentActivity bakiEntries={bakiEntries} payments={payments} />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
