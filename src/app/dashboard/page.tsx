"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/shared/DashboardHeader";
import BottomNav from "@/components/shared/BottomNav";
import RoleSwitcher from "@/components/shared/RoleSwitcher";
import BalanceCard from "@/components/dashboard/BalanceCard";
import QuickActions from "@/components/dashboard/QuickActions";
import CustomerList from "@/components/dashboard/CustomerList";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AddCustomerModal from "@/components/modals/AddCustomerModal";
import AddBakiModal from "@/components/modals/AddBakiModal";
import AddPaymentModal from "@/components/modals/AddPaymentModal";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export default function DokandarDashboard() {
  const router = useRouter();
  const { 
    customers, 
    bakiEntries, 
    payments, 
    addCustomer, 
    addBaki, 
    addPayment,
    isSubscribed,
    trialDaysLeft,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'customers' | 'activity'>('customers');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddBaki, setShowAddBaki] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  // Calculate totals
  const totalDue = customers.reduce((sum, c) => sum + c.balance, 0);
  const pendingBaki = bakiEntries.filter(b => b.status === 'pending').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const pendingEntries = pendingBaki + pendingPayments;

  const handleAddCustomer = (phone: string, name: string) => {
    addCustomer(phone, name);
    toast.success("গ্রাহক যোগ হয়েছে!", {
      description: `${name} সফলভাবে যোগ হয়েছে।`,
    });
  };

  const handleAddBaki = (customerId: string, amount: number, description?: string) => {
    addBaki(customerId, amount, description);
    toast.success("বাকি যোগ হয়েছে!", {
      description: `৳${amount} বাকি যোগ হয়েছে। গ্রাহকের নিশ্চিতকরণ পেন্ডিং।`,
    });
  };

  const handleAddPayment = (customerId: string, amount: number, method: "cash" | "bkash" | "nagad") => {
    addPayment(customerId, amount, method);
    toast.success("পেমেন্ট যোগ হয়েছে!", {
      description: `৳${amount} পেমেন্ট যোগ হয়েছে। গ্রাহকের নিশ্চিতকরণ পেন্ডিং।`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      <RoleSwitcher />
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Trial Banner */}
        {!isSubscribed && (
          <div 
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-accent/10 border border-accent/30 cursor-pointer active:bg-accent/20 transition-colors"
            onClick={() => router.push('/subscription')}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base text-accent-foreground">
                  ট্রায়াল: {trialDaysLeft} দিন বাকি
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  সাবস্ক্রাইব করুন এবং সব সুবিধা পান
                </p>
              </div>
              <span className="text-xs sm:text-sm font-medium text-accent whitespace-nowrap">সাবস্ক্রাইব →</span>
            </div>
          </div>
        )}

        {/* Balance Overview */}
        <BalanceCard 
          totalDue={totalDue} 
          totalCustomers={customers.length}
          pendingEntries={pendingEntries}
        />

        {/* Quick Actions */}
        <QuickActions
          onAddBaki={() => setShowAddBaki(true)}
          onAddCustomer={() => setShowAddCustomer(true)}
          onAddPayment={() => setShowAddPayment(true)}
          onViewLedger={() => router.push('/ledger')}
        />

        {/* Tabs */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 py-3 sm:py-4 text-center text-sm sm:text-base font-medium transition-colors ${
                activeTab === 'customers'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground active:text-foreground'
              }`}
            >
              গ্রাহক ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-3 sm:py-4 text-center text-sm sm:text-base font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground active:text-foreground'
              }`}
            >
              সাম্প্রতিক ({bakiEntries.length + payments.length})
            </button>
          </div>

          {activeTab === 'customers' ? (
            <CustomerList customers={customers} />
          ) : (
            <RecentActivity bakiEntries={bakiEntries} payments={payments} />
          )}
        </div>
      </main>

      <BottomNav />

      {/* Modals */}
      <AddCustomerModal
        open={showAddCustomer}
        onOpenChange={setShowAddCustomer}
        onSubmit={handleAddCustomer}
      />

      <AddBakiModal
        open={showAddBaki}
        onOpenChange={setShowAddBaki}
        onSubmit={handleAddBaki}
        customers={customers}
      />

      <AddPaymentModal
        open={showAddPayment}
        onOpenChange={setShowAddPayment}
        onSubmit={handleAddPayment}
        customers={customers}
      />
    </div>
  );
}
