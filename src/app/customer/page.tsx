"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import BottomNav from "@/components/shared/BottomNav";
import { useApp } from "@/contexts/AppContext";
import { formatBDT } from "@/lib/formatters";
import { Store, CheckCircle, AlertCircle, TrendingUp, Clock, FileText, Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/use-mobile";

interface PendingEntry {
  id: number;
  type: "credit" | "payment";
  amount: number;
  date: string;
  description?: string;
  method?: string;
  shop_name: string;
  customer_id: number;
  createdAt: string;
}

interface LedgerEntry {
  id: number;
  type: "credit" | "payment";
  amount: number;
  date: string;
  description?: string;
  payment_method?: string;
  status: string;
  createdAt: string;
}

interface ShopLedger {
  shop: {
    id: number;
    name: string;
  };
  ledger: LedgerEntry[];
  balance: {
    total_credits: number;
    total_payments: number;
    current_due: number;
  };
}

export default function CustomerDashboard() {
  const router = useRouter();
  const { customerShops, refreshCustomerShops, user } = useApp();
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [pendingEntries, setPendingEntries] = useState<PendingEntry[]>([]);
  const [shopLedgers, setShopLedgers] = useState<ShopLedger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [shopFilter, setShopFilter] = useState<string>("all");
  const isMobile = useIsMobile();

  useEffect(() => {
    // Refresh customer shops on mount and when user changes
    const fetchShops = async () => {
      await refreshCustomerShops();
    };
    fetchShops();
  }, [refreshCustomerShops, user]);

  useEffect(() => {
    if (customerShops.length > 0 && !selectedShopId) {
      setSelectedShopId(customerShops[0].shop_id);
    }
  }, [customerShops, selectedShopId]);

  useEffect(() => {
    fetchPendingEntries();
    fetchCustomerLedger();
    // Refresh periodically
    const interval = setInterval(() => {
      fetchPendingEntries();
      fetchCustomerLedger();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchPendingEntries = async () => {
    try {
      const response = await axiosInstance.get("/api/transactions/ledger/pending/");
      const data = response.data;
      
      // Combine pending credits and payments
      const combined: PendingEntry[] = [
        ...(data.pending_credits || []).map((entry: any) => ({
          id: entry.id,
          type: "credit" as const,
          amount: parseFloat(entry.amount) || 0,
          date: entry.date,
          description: entry.description,
          shop_name: entry.customer?.shop_name || entry.customer?.shop?.name || "দোকান",
          customer_id: entry.customer?.id,
          createdAt: entry.createdAt || entry.created_at,
        })),
        ...(data.pending_payments || []).map((entry: any) => ({
          id: entry.id,
          type: "payment" as const,
          amount: parseFloat(entry.amount) || 0,
          date: entry.date,
          method: entry.method || entry.payment_method,
          shop_name: entry.customer?.shop_name || entry.customer?.shop?.name || "দোকান",
          customer_id: entry.customer?.id,
          createdAt: entry.createdAt || entry.created_at,
        })),
      ];
      
      // Sort by creation date (newest first)
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setPendingEntries(combined);
    } catch (error: any) {
      console.error("Failed to fetch pending entries:", error);
      setPendingEntries([]);
    }
  };

  const fetchCustomerLedger = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/transactions/ledger/my/");
      const data = response.data;
      setShopLedgers(data.shops || []);
    } catch (error: any) {
      console.error("Failed to fetch customer ledger:", error);
      setShopLedgers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (entryId: number, type: "credit" | "payment") => {
    setIsConfirming(entryId);
    try {
      const endpoint = type === "credit" 
        ? `/api/transactions/credits/${entryId}/confirm/`
        : `/api/transactions/payments/${entryId}/confirm/`;
      
      await axiosInstance.post(endpoint, {
        action: "confirm",
      });
      
      toast.success("নিশ্চিত করা হয়েছে!", {
        description: "লেনদেন নিশ্চিত করা হয়েছে।",
      });
      
      // Refresh data
      await fetchPendingEntries();
      await fetchCustomerLedger();
      await refreshCustomerShops();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "নিশ্চিতকরণ ব্যর্থ";
      toast.error("নিশ্চিতকরণ ব্যর্থ", {
        description: errorMessage,
      });
    } finally {
      setIsConfirming(null);
    }
  };

  const handleReject = async (entryId: number, type: "credit" | "payment") => {
    setIsConfirming(entryId);
    try {
      const endpoint = type === "credit" 
        ? `/api/transactions/credits/${entryId}/confirm/`
        : `/api/transactions/payments/${entryId}/confirm/`;
      
      await axiosInstance.post(endpoint, {
        action: "reject",
        rejected_reason: "গ্রাহক কর্তৃক প্রত্যাখ্যান",
      });
      
      toast.success("প্রত্যাখ্যান করা হয়েছে!", {
        description: "লেনদেন প্রত্যাখ্যান করা হয়েছে।",
      });
      
      // Refresh data
      await fetchPendingEntries();
      await fetchCustomerLedger();
      await refreshCustomerShops();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "প্রত্যাখ্যান ব্যর্থ";
      toast.error("প্রত্যাখ্যান ব্যর্থ", {
        description: errorMessage,
      });
    } finally {
      setIsConfirming(null);
    }
  };

  const selectedShop = customerShops.find(s => s.shop_id === selectedShopId);
  const selectedShopLedger = shopLedgers.find(l => l.shop.id === selectedShopId);
  const totalBalance = customerShops.reduce((sum, shop) => sum + shop.balance, 0);

  // Filter by date range
  const filterByDate = (date: string | Date): boolean => {
    if (!dateRange?.from && !dateRange?.to) return true;
    
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);
    
    if (dateRange.from && dateRange.to) {
      const start = new Date(dateRange.from);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateRange.to);
      end.setHours(23, 59, 59, 999);
      return entryDate >= start && entryDate <= end;
    }
    
    if (dateRange.from) {
      const start = new Date(dateRange.from);
      start.setHours(0, 0, 0, 0);
      return entryDate >= start;
    }
    
    if (dateRange.to) {
      const end = new Date(dateRange.to);
      end.setHours(23, 59, 59, 999);
      return entryDate <= end;
    }
    
    return true;
  };

  // Transform ledger entries to BakiEntry and PaymentEntry format for RecentActivity
  const transformLedgerEntries = (ledger: ShopLedger) => {
    const bakiEntries = ledger.ledger
      .filter(e => e.type === "credit")
      .filter(e => filterByDate(e.date))
      .map(e => ({
        id: e.id,
        customer: { id: 0, name: ledger.shop.name, phone: "", balance: 0, created_at: e.date, updated_at: e.date },
        customerId: 0,
        amount: parseFloat(String(e.amount)) || 0,
        date: e.date,
        description: e.description,
        status: e.status as "pending" | "confirmed" | "rejected",
        createdAt: e.createdAt || e.date,
        confirmedAt: e.status === "confirmed" ? e.createdAt : undefined,
      }));

    const payments = ledger.ledger
      .filter(e => e.type === "payment")
      .filter(e => filterByDate(e.date))
      .map(e => ({
        id: e.id,
        customer: { id: 0, name: ledger.shop.name, phone: "", balance: 0, created_at: e.date, updated_at: e.date },
        customerId: 0,
        amount: parseFloat(String(e.amount)) || 0,
        date: e.date,
        method: (e.payment_method || "cash") as "cash" | "bkash" | "nagad",
        status: e.status as "pending" | "confirmed" | "rejected",
        createdAt: e.createdAt || e.date,
        confirmedAt: e.status === "confirmed" ? e.createdAt : undefined,
      }));

    return { bakiEntries, payments, shopId: ledger.shop.id };
  };

  // Filter by shop
  const filteredLedgers = shopFilter === "all" 
    ? shopLedgers 
    : shopLedgers.filter(l => l.shop.id === parseInt(shopFilter, 10));

  const allBakiEntries = filteredLedgers.flatMap(l => transformLedgerEntries(l).bakiEntries);
  const allPayments = filteredLedgers.flatMap(l => transformLedgerEntries(l).payments);

  const clearDateFilter = () => {
    setDateRange(undefined);
  };

  const hasDateFilter = dateRange?.from || dateRange?.to;

  if (customerShops.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <DashboardHeader />
        <main className="container py-4 sm:py-6">
          <Card className="p-6 text-center">
            <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-display font-semibold text-lg mb-2">কোন দোকান পাওয়া যায়নি</h3>
            <p className="text-sm text-muted-foreground">
              আপনার ফোন নম্বর দিয়ে কোন দোকানদার এখনও আপনাকে গ্রাহক হিসেবে যোগ করেননি।
            </p>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Pending Entries Section */}
        {pendingEntries.length > 0 && (
          <Card className="p-4 sm:p-5 border-2 border-pending/30 bg-pending/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pending/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-pending" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-base sm:text-lg">নিশ্চিতকরণ প্রয়োজন</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {pendingEntries.length} টি লেনদেন আপনার নিশ্চিতকরণের অপেক্ষায়
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {pendingEntries.map((entry) => (
                <div
                  key={`${entry.type}-${entry.id}`}
                  className="p-3 sm:p-4 rounded-lg bg-card border border-border/50"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">{entry.shop_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          entry.type === "credit" 
                            ? "bg-destructive/10 text-destructive" 
                            : "bg-success/10 text-success"
                        }`}>
                          {entry.type === "credit" ? "বাকি" : "পেমেন্ট"}
                        </span>
                      </div>
                      <p className="font-semibold text-base sm:text-lg text-foreground mb-1">
                        {formatBDT(entry.amount)}
                      </p>
                      {entry.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground">{entry.description}</p>
                      )}
                      {entry.method && (
                        <p className="text-xs text-muted-foreground">পদ্ধতি: {entry.method === "cash" ? "ক্যাশ" : entry.method === "bkash" ? "বিকাশ" : "নগদ"}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                      onClick={() => handleConfirm(entry.id, entry.type)}
                      disabled={isConfirming === entry.id}
                    >
                      {isConfirming === entry.id ? "অপেক্ষা করুন..." : "নিশ্চিত করুন"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                      onClick={() => handleReject(entry.id, entry.type)}
                      disabled={isConfirming === entry.id}
                    >
                      প্রত্যাখ্যান
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Total Balance Card */}
        <div className="relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl gradient-hero text-primary-foreground shadow-elevated overflow-hidden">
          <div className="hidden sm:block absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="min-w-0 flex-1">
                <p className="text-primary-foreground/80 text-xs sm:text-sm mb-0.5 sm:mb-1">সব দোকানে মোট বাকি</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold bengali-number truncate">
                  {formatBDT(totalBalance)}
                </h2>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ml-3">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-primary-foreground/70">
              {customerShops.length} টি দোকানে
            </p>
          </div>
        </div>

        {/* Shop List */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-base">আপনার দোকানসমূহ</h3>
          {customerShops.map((shop) => (
            <Card
              key={shop.shop_id}
              className={`p-4 cursor-pointer transition-all ${
                selectedShopId === shop.shop_id
                  ? 'border-primary shadow-md bg-primary/5'
                  : 'border-border/50 hover:border-primary/50'
              }`}
              onClick={() => setSelectedShopId(shop.shop_id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-semibold text-base mb-1">{shop.shop_name}</h4>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold mb-1">
                    {formatBDT(shop.balance)}
                  </div>
                  <div className="flex items-center gap-1 text-success text-xs">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>সংযুক্ত</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-base sm:text-lg">লেনদেনের ইতিহাস</h3>
              {(shopFilter !== "all" || hasDateFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShopFilter("all");
                    clearDateFilter();
                  }}
                  className="h-8 sm:h-9 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">সব ফিল্টার সরান</span>
                  <span className="sm:hidden">সব</span>
                </Button>
              )}
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Shop Filter */}
              <div className="flex-1 min-w-0">
                <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block font-medium">
                  দোকান
                </label>
                <Select value={shopFilter} onValueChange={setShopFilter}>
                  <SelectTrigger className={cn(
                    "h-10 sm:h-11 text-sm sm:text-base w-full",
                    shopFilter !== "all" && "border-primary bg-primary/5"
                  )}>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Store className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <SelectValue placeholder="সব দোকান" className="text-left" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব দোকান</SelectItem>
                    {customerShops.map((shop) => (
                      <SelectItem key={shop.shop_id} value={String(shop.shop_id)}>
                        {shop.shop_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="flex-1 min-w-0">
                <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block font-medium">
                  তারিখ
                </label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={hasDateFilter ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-10 sm:h-11 text-sm sm:text-base justify-start text-left font-normal flex-1 min-w-0",
                          !hasDateFilter && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate min-w-0 text-left">
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                <span className="hidden sm:inline">
                                  {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                                </span>
                                <span className="sm:hidden">
                                  {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="hidden sm:inline">{format(dateRange.from, "dd/MM/yyyy")}</span>
                                <span className="sm:hidden">{format(dateRange.from, "dd/MM/yy")}</span>
                              </>
                            )
                          ) : (
                            <span>তারিখ নির্বাচন করুন</span>
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={isMobile ? 1 : 2}
                        className="rounded-md border-0"
                      />
                      {hasDateFilter && (
                        <div className="p-3 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearDateFilter}
                            className="w-full h-9 text-sm"
                          >
                            <X className="w-4 h-4 mr-2" />
                            ফিল্টার সরান
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                  {hasDateFilter && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearDateFilter}
                      className="h-10 sm:h-11 w-10 sm:w-11 p-0 flex-shrink-0"
                      aria-label="Clear date filter"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-auto p-1">
              <TabsTrigger value="all" className="py-2.5 sm:py-3 text-xs sm:text-sm">সব</TabsTrigger>
              <TabsTrigger value="baki" className="py-2.5 sm:py-3 text-xs sm:text-sm">বাকি</TabsTrigger>
              <TabsTrigger value="payment" className="py-2.5 sm:py-3 text-xs sm:text-sm">পেমেন্ট</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
                </div>
              ) : allBakiEntries.length === 0 && allPayments.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-display font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">কোনো লেনদেন নেই</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    এখনও কোনো লেনদেন করা হয়নি
                  </p>
                </div>
              ) : (
                <RecentActivity bakiEntries={allBakiEntries} payments={allPayments} />
              )}
            </TabsContent>

            <TabsContent value="baki" className="mt-0">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
                </div>
              ) : allBakiEntries.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-display font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">কোনো বাকি নেই</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    এখনও কোনো বাকি যোগ করা হয়নি
                  </p>
                </div>
              ) : (
                <RecentActivity bakiEntries={allBakiEntries} payments={[]} />
              )}
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
                </div>
              ) : allPayments.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-display font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">কোনো পেমেন্ট নেই</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    এখনও কোনো পেমেন্ট করা হয়নি
                  </p>
                </div>
              ) : (
                <RecentActivity bakiEntries={[]} payments={allPayments} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
