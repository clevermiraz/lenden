"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/shared/DashboardHeader";
import BottomNav from "@/components/shared/BottomNav";
import RoleSwitcher from "@/components/shared/RoleSwitcher";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AddBakiModal from "@/components/modals/AddBakiModal";
import AddPaymentModal from "@/components/modals/AddPaymentModal";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { formatBDT, formatPhone, formatDate } from "@/lib/formatters";
import { ArrowLeft, Plus, CreditCard, Phone, Calendar, User } from "lucide-react";
import { toast } from "sonner";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customers, bakiEntries, payments, addBaki, addPayment } = useApp();
  
  const [showAddBaki, setShowAddBaki] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="font-display text-lg sm:text-xl font-semibold mb-3">গ্রাহক পাওয়া যায়নি</h2>
          <Button variant="outline" onClick={() => router.back()} className="h-9 sm:h-10 text-sm">
            <ArrowLeft className="w-4 h-4" />
            ফিরে যান
          </Button>
        </div>
      </div>
    );
  }

  // Filter entries for this customer
  const customerBaki = bakiEntries.filter(b => b.customerId === id);
  const customerPayments = payments.filter(p => p.customerId === id);

  const handleAddBaki = (customerId: string, amount: number, description?: string) => {
    addBaki(customerId, amount, description);
    toast.success("বাকি যোগ হয়েছে!", {
      description: `৳${amount} বাকি যোগ হয়েছে।`,
    });
  };

  const handleAddPayment = (customerId: string, amount: number, method: "cash" | "bkash" | "nagad") => {
    addPayment(customerId, amount, method);
    toast.success("পেমেন্ট যোগ হয়েছে!", {
      description: `৳${amount} পেমেন্ট যোগ হয়েছে।`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      <RoleSwitcher />
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => router.back()} className="-ml-2 h-9 text-sm">
          <ArrowLeft className="w-4 h-4" />
          ফিরে যান
        </Button>

        {/* Customer Info Card */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="font-display text-xl sm:text-2xl font-bold text-primary">
                {customer.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl sm:text-2xl font-bold truncate">{customer.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">{formatPhone(customer.phone)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">যোগ: {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="p-3 sm:p-4 rounded-xl bg-secondary/50">
            <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">বর্তমান ব্যালেন্স</p>
            <p className={`font-display text-2xl sm:text-3xl font-bold bengali-number ${
              customer.balance > 0 ? 'text-destructive' : customer.balance < 0 ? 'text-success' : ''
            }`}>
              {formatBDT(Math.abs(customer.balance))}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {customer.balance > 0 ? 'বাকি আছে' : customer.balance < 0 ? 'পাওনা আছে' : 'ব্যালেন্স শূন্য'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Button
            variant="hero"
            onClick={() => setShowAddBaki(true)}
            className="h-auto py-3 sm:py-4 flex flex-col gap-1.5 sm:gap-2 active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">বাকি যোগ</span>
          </Button>
          <Button
            variant="success"
            onClick={() => setShowAddPayment(true)}
            className="h-auto py-3 sm:py-4 flex flex-col gap-1.5 sm:gap-2 active:scale-95 transition-transform"
          >
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">পেমেন্ট যোগ</span>
          </Button>
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-border">
            <h3 className="font-display font-semibold text-sm sm:text-base">লেনদেনের ইতিহাস</h3>
          </div>
          <RecentActivity bakiEntries={customerBaki} payments={customerPayments} />
        </div>
      </main>

      <BottomNav />

      <AddBakiModal
        open={showAddBaki}
        onOpenChange={setShowAddBaki}
        onSubmit={handleAddBaki}
        customers={[customer]}
      />

      <AddPaymentModal
        open={showAddPayment}
        onOpenChange={setShowAddPayment}
        onSubmit={handleAddPayment}
        customers={[customer]}
      />
    </div>
  );
}
