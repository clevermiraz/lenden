"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/shared/DashboardHeader";
import BottomNav from "@/components/shared/BottomNav";
import RoleSwitcher from "@/components/shared/RoleSwitcher";
import CustomerList from "@/components/dashboard/CustomerList";
import AddCustomerModal from "@/components/modals/AddCustomerModal";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Users } from "lucide-react";
import { toast } from "sonner";

export default function CustomersPage() {
  const { customers, addCustomer } = useApp();
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleAddCustomer = (phone: string, name: string) => {
    addCustomer(phone, name);
    toast.success("গ্রাহক যোগ হয়েছে!", {
      description: `${name} সফলভাবে যোগ হয়েছে।`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      <RoleSwitcher />
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl font-bold">গ্রাহক তালিকা</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">মোট {customers.length} জন গ্রাহক</p>
          </div>
          <Button variant="hero" onClick={() => setShowAddCustomer(true)} className="h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">যোগ করুন</span>
            <span className="sm:hidden">যোগ</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Customer List */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <h4 className="font-display font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">
                {searchQuery ? "কোনো গ্রাহক পাওয়া যায়নি" : "কোনো গ্রাহক নেই"}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                {searchQuery ? "অন্য কিছু দিয়ে খুঁজুন" : "নতুন গ্রাহক যোগ করুন শুরু করতে"}
              </p>
              {!searchQuery && (
                <Button variant="outline" onClick={() => setShowAddCustomer(true)} className="h-9 sm:h-10 text-xs sm:text-sm">
                  <UserPlus className="w-4 h-4" />
                  গ্রাহক যোগ করুন
                </Button>
              )}
            </div>
          ) : (
            <CustomerList customers={filteredCustomers} />
          )}
        </div>
      </main>

      <BottomNav />

      <AddCustomerModal
        open={showAddCustomer}
        onOpenChange={setShowAddCustomer}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
}
