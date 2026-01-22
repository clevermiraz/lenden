"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Types
export type UserRole = "shop_owner" | "customer";

export interface User {
  id: number;
  phone: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  date_joined: string;
}

export interface Shop {
  id: number;
  name: string;
  shopName?: string;
  phone_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  phone: string;
  name?: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export type EntryStatus = "pending" | "confirmed" | "rejected";

export interface BakiEntry {
  id: number;
  customer: Customer;
  customerId?: number;
  amount: number;
  date: string;
  description?: string;
  status: EntryStatus;
  rejected_reason?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface PaymentEntry {
  id: number;
  customer: Customer;
  customerId?: number;
  amount: number;
  date: string;
  method: "cash" | "bkash" | "nagad";
  status: EntryStatus;
  rejected_reason?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface CustomerShop {
  shop_id: number;
  shop_name: string;
  shop_type: string;
  customer_id: number;
  customer_name?: string;
  balance: number;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AppContextType {
  // Authentication state
  isAuthenticated: boolean;
  user: User | null;
  shop: Shop | null;
  customerShops: CustomerShop[];
  userType: UserRole | null;
  isLoading: boolean;
  
  // Shop owner data
  customers: Customer[];
  bakiEntries: BakiEntry[];
  payments: PaymentEntry[];
  isSubscribed: boolean;
  trialDaysLeft: number;
  
  // Computed
  currentRole: UserRole; // For backward compatibility with existing components
  userProfile: User | null; // Alias for user
  notifications: Notification[]; // Notifications list
  
  // Actions
  login: (phone: string, password: string) => Promise<UserRole>;
  register: (phone: string, password: string, firstName?: string, lastName?: string, userType?: UserRole) => Promise<UserRole>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshShop: () => Promise<void>;
  refreshCustomerShops: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  setupShop: (shopName: string, phone: string, address?: string) => Promise<void>;
  addCustomer: (phone: string, name?: string) => Promise<void>;
  addBaki: (customerId: string, amount: number, description?: string) => Promise<void>;
  addPayment: (customerId: string, amount: number, method: "cash" | "bkash" | "nagad") => Promise<void>;
  switchRole?: (role: UserRole) => void; // For demo purposes only
  markNotificationRead?: (id: number) => void;
  clearAllNotifications?: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [customerShops, setCustomerShops] = useState<CustomerShop[]>([]);
  const [userType, setUserType] = useState<UserRole | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Shop owner data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bakiEntries, setBakiEntries] = useState<BakiEntry[]>([]);
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(30);
  
  // Computed currentRole for backward compatibility
  const currentRole: UserRole = userType || (shop ? 'shop_owner' : 'customer');
  const userProfile = user; // Alias for backward compatibility

  // Fetch customers for shop owners
  const refreshCustomers = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/customers/");
      setCustomers(response.data.customers || []);
    } catch (error) {
      setCustomers([]);
    }
  }, []);

  // Fetch transactions for shop owners
  const refreshTransactions = useCallback(async () => {
    try {
      const ledgerResponse = await axiosInstance.get("/api/transactions/ledger/shop/");
      const ledger = ledgerResponse.data;
      
      // Backend returns credits and payments arrays
      const credits = ledger.credits || [];
      const payments = ledger.payments || [];
      
      // Transform credits to BakiEntry format
      const transformedCredits: BakiEntry[] = credits.map((entry: any) => ({
        id: entry.id,
        customer: entry.customer,
        customerId: entry.customer?.id || entry.customer_id,
        amount: parseFloat(entry.amount) || 0,
        date: entry.date,
        description: entry.description || '',
        status: entry.status || 'pending',
        rejected_reason: entry.rejected_reason,
        createdAt: entry.createdAt || entry.created_at,
        confirmedAt: entry.confirmedAt || entry.confirmed_at,
      }));
      
      // Transform payments to PaymentEntry format
      const transformedPayments: PaymentEntry[] = payments.map((entry: any) => ({
        id: entry.id,
        customer: entry.customer,
        customerId: entry.customer?.id || entry.customer_id,
        amount: parseFloat(entry.amount) || 0,
        date: entry.date,
        method: entry.method || entry.payment_method || 'cash',
        status: entry.status || 'pending',
        rejected_reason: entry.rejected_reason,
        createdAt: entry.createdAt || entry.created_at,
        confirmedAt: entry.confirmedAt || entry.confirmed_at,
      }));
      
      setBakiEntries(transformedCredits);
      setPayments(transformedPayments);
    } catch (error: any) {
      console.error("Failed to refresh transactions:", error);
      console.error("Error response:", error.response?.data);
      setBakiEntries([]);
      setPayments([]);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const response = await axiosInstance.get("/api/auth/profile/");
          const userData = response.data;
          setUser(userData);
          setIsAuthenticated(true);
          
          // Get userType from profile response
          const detectedUserType: UserRole = userData.userType || 'shop_owner';
          setUserType(detectedUserType);
          
          // Fetch data based on userType - don't call /api/shops/ for customers
          if (detectedUserType === 'shop_owner') {
            // For shop owners, fetch shop data
            try {
              const shopResponse = await axiosInstance.get("/api/shops/");
              setShop(shopResponse.data);
              setCustomerShops([]);
              // Fetch shop owner data
              await refreshCustomers();
              await refreshTransactions();
            } catch (error) {
              setShop(null);
              setCustomers([]);
              setBakiEntries([]);
              setPayments([]);
            }
          } else if (detectedUserType === 'customer') {
            // For customers, fetch customer shops (don't call /api/shops/)
            setShop(null);
            setCustomers([]);
            setBakiEntries([]);
            setPayments([]);
            try {
              const customerShopsResponse = await axiosInstance.get("/api/auth/customer-shops/");
              const shops = customerShopsResponse.data.shops || [];
              setCustomerShops(shops);
            } catch (error) {
              setCustomerShops([]);
            }
          }
        }
      } catch (error) {
        // Not authenticated
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
        setUser(null);
        setShop(null);
        setCustomerShops([]);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [refreshCustomers, refreshTransactions]);

  const login = useCallback(async (phone: string, password: string) => {
    try {
      const response = await axiosInstance.post("/api/auth/login/", { phone, password });
      const { user: userData, tokens, userType } = response.data;
      
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store userType from backend response
      const detectedUserType = userType || 'shop_owner';
      setUserType(detectedUserType);
      
      // Intelligently fetch data based on userType from backend
      if (detectedUserType === 'shop_owner') {
        // Try to fetch shop (for shop owners)
        try {
          const shopResponse = await axiosInstance.get("/api/shops/");
          setShop(shopResponse.data);
          // Fetch shop owner data
          await refreshCustomers();
          await refreshTransactions();
        } catch (error) {
          setShop(null);
          setCustomers([]);
          setBakiEntries([]);
          setPayments([]);
        }
        setCustomerShops([]);
      } else if (detectedUserType === 'customer') {
        // For customers, shop is null (they see shops via customer-shops endpoint)
        setShop(null);
        setCustomers([]);
        setBakiEntries([]);
        setPayments([]);
        // Fetch customer shops
        try {
          const customerShopsResponse = await axiosInstance.get("/api/auth/customer-shops/");
          setCustomerShops(customerShopsResponse.data.shops || []);
        } catch (error) {
          setCustomerShops([]);
        }
      }
      
      toast.success("লগইন সফল!", {
        description: "স্বাগতম!",
      });
      
      return detectedUserType;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "লগইন ব্যর্থ হয়েছে";
      toast.error("লগইন ব্যর্থ", {
        description: errorMessage,
      });
      throw error;
    }
  }, []);

  const register = useCallback(async (phone: string, password: string, firstName?: string, lastName?: string, userType: UserRole | "dokandar" = "shop_owner") => {
    try {
      // Normalize userType: convert 'dokandar' to 'shop_owner' for backward compatibility
      const normalizedUserType: UserRole = (userType === 'dokandar' || userType === 'shop_owner') ? 'shop_owner' : userType;
      
      const response = await axiosInstance.post("/api/auth/register/", {
        phone,
        password,
        first_name: firstName,
        last_name: lastName,
        userType: normalizedUserType,
      });
      const { user: userData, tokens, userType: registeredUserType } = response.data;
      
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store userType from backend response
      const detectedUserType = registeredUserType || normalizedUserType || 'shop_owner';
      setUserType(detectedUserType);
      
      // Intelligently fetch data based on userType from backend
      if (detectedUserType === "shop_owner") {
        // For shop owners, check if shop exists
        setShop(null);
        setCustomers([]);
        setBakiEntries([]);
        setPayments([]);
        setCustomerShops([]);
        try {
          const shopResponse = await axiosInstance.get("/api/shops/");
          setShop(shopResponse.data);
          // If shop exists, fetch shop owner data
          if (shopResponse.data) {
            await refreshCustomers();
            await refreshTransactions();
          }
        } catch (error) {
          // Shop doesn't exist yet, that's okay - they'll create it
          setShop(null);
        }
      } else {
        // For customers, shop is null (they see shops via customer-shops endpoint)
        setShop(null);
        setCustomers([]);
        setBakiEntries([]);
        setPayments([]);
        // Fetch customer shops - this links existing Customer records
        // Add a small delay to ensure backend transaction is complete
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
          const customerShopsResponse = await axiosInstance.get("/api/auth/customer-shops/");
          const shops = customerShopsResponse.data.shops || customerShopsResponse.data || [];
          setCustomerShops(Array.isArray(shops) ? shops : []);
        } catch (error) {
          console.error("Failed to fetch customer shops:", error);
          setCustomerShops([]);
        }
      }
      
      toast.success("রেজিস্ট্রেশন সফল!", {
        description: "আপনার একাউন্ট তৈরি হয়েছে",
      });
      
      return detectedUserType;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে";
      toast.error("রেজিস্ট্রেশন ব্যর্থ", {
        description: errorMessage,
      });
      throw error;
    }
  }, []);

  const refreshShop = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/shops/");
      setShop(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setShop(null);
      }
      throw error;
    }
  }, []);

  const setupShop = useCallback(async (shopName: string, phone: string, address?: string) => {
    try {
      const response = await axiosInstance.post("/api/shops/", {
        shopName,
        phone,
        address: address || '',
      });
      
      // Handle response - backend returns { message, shop }
      if (response.data && response.data.shop) {
        setShop(response.data.shop);
        // Refresh shop data to ensure consistency
        try {
          await refreshShop();
        } catch (refreshError) {
          // If refresh fails, that's okay - we already have the shop data
          console.warn('Failed to refresh shop after creation:', refreshError);
        }
      } else {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response from server');
      }
      
      toast.success("দোকান তৈরি সফল!", {
        description: "আপনার দোকান তৈরি হয়েছে",
      });
    } catch (error: any) {
      console.error('Shop creation error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "দোকান তৈরি ব্যর্থ হয়েছে";
      toast.error("দোকান তৈরি ব্যর্থ", {
        description: errorMessage,
      });
      throw error;
    }
  }, [refreshShop]);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setUser(null);
    setShop(null);
    setCustomerShops([]);
    setUserType(null);
    router.push("/auth/login");
    toast.success("লগআউট সফল");
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/auth/profile/");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, []);

  const refreshCustomerShops = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/auth/customer-shops/");
      const shops = response.data.shops || response.data || [];
      const shopsArray = Array.isArray(shops) ? shops : [];
      console.log("Fetched customer shops:", shopsArray);
      setCustomerShops(shopsArray);
    } catch (error: any) {
      console.error("Failed to fetch customer shops:", error);
      console.error("Error response:", error.response?.data);
      setCustomerShops([]);
    }
  }, []);

  // Add customer
  const addCustomer = useCallback(async (phone: string, name?: string) => {
    try {
      const response = await axiosInstance.post("/api/customers/create/", {
        phone,
        name: name || undefined,
      });
      if (response.data.customer) {
        await refreshCustomers();
        toast.success("গ্রাহক যোগ হয়েছে!", {
          description: `${name || phone} সফলভাবে যোগ হয়েছে।`,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "গ্রাহক যোগ ব্যর্থ";
      toast.error("গ্রাহক যোগ ব্যর্থ", {
        description: errorMessage,
      });
      throw error;
    }
  }, [refreshCustomers]);

  // Add baki (credit entry)
  const addBaki = useCallback(async (customerId: string, amount: number, description?: string) => {
    try {
      const response = await axiosInstance.post("/api/transactions/credits/create/", {
        customerId: parseInt(customerId),
        amount: amount.toString(),
        description: description || undefined,
      });
      if (response.data.credit_entry) {
        await refreshTransactions();
        await refreshCustomers();
        toast.success("বাকি যোগ হয়েছে!", {
          description: `৳${amount} বাকি যোগ হয়েছে। গ্রাহকের নিশ্চিতকরণ পেন্ডিং।`,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "বাকি যোগ ব্যর্থ";
      toast.error("বাকি যোগ ব্যর্থ", {
        description: errorMessage,
      });
      throw error;
    }
  }, [refreshTransactions, refreshCustomers]);

  // Add payment
  const addPayment = useCallback(async (customerId: string, amount: number, method: "cash" | "bkash" | "nagad") => {
    try {
      const response = await axiosInstance.post("/api/transactions/payments/create/", {
        customerId: parseInt(customerId),
        amount: amount.toString(),
        method,
      });
      if (response.data.payment_entry) {
        await refreshTransactions();
        await refreshCustomers();
        toast.success("পেমেন্ট যোগ হয়েছে!", {
          description: `৳${amount} পেমেন্ট যোগ হয়েছে। গ্রাহকের নিশ্চিতকরণ পেন্ডিং।`,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "পেমেন্ট যোগ ব্যর্থ";
      toast.error("পেমেন্ট যোগ ব্যর্থ", {
        description: errorMessage,
      });
      throw error;
    }
  }, [refreshTransactions, refreshCustomers]);

  // Demo role switcher (for UI demo purposes only)
  const switchRole = useCallback((role: UserRole) => {
    // This is just for demo UI - actual user type comes from backend
    // In production, this wouldn't change the actual user type
    setUserType(role);
  }, []);

  // Stub functions for notifications (to be implemented with backend)
  const markNotificationRead = useCallback((id: number) => {
    // TODO: Implement with backend API
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearAllNotifications = useCallback(() => {
    // TODO: Implement with backend API
    setNotifications([]);
  }, []);

  const value: AppContextType = {
    isAuthenticated,
    user,
    shop,
    customerShops,
    userType,
    currentRole,
    userProfile,
    notifications,
    isLoading,
    customers,
    bakiEntries,
    payments,
    isSubscribed,
    trialDaysLeft,
    login,
    register,
    logout,
    refreshUser,
    refreshShop,
    refreshCustomerShops,
    refreshCustomers,
    refreshTransactions,
    setupShop,
    addCustomer,
    addBaki,
    addPayment,
    switchRole,
    markNotificationRead,
    clearAllNotifications,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
