"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// Types
export type UserRole = "dokandar" | "customer";
export type EntryStatus = "pending" | "confirmed" | "rejected";
export type PaymentMethod = "cash" | "bkash" | "nagad";

export interface Customer {
  id: string;
  phone: string;
  name: string;
  balance: number;
  lastTransaction?: Date;
  createdAt: Date;
}

export interface BakiEntry {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  description?: string;
  status: EntryStatus;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface PaymentEntry {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: EntryStatus;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "baki" | "payment" | "info";
  read: boolean;
  createdAt: Date;
}

export interface Shop {
  id: string;
  name: string;
  phone: string;
  address?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
}

interface AppContextType {
  // Authentication state
  isAuthenticated: boolean;
  hasShop: boolean;
  userProfile: UserProfile | null;
  shop: Shop | null;
  
  // Role switching (for demo)
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  
  // Data
  customers: Customer[];
  bakiEntries: BakiEntry[];
  payments: PaymentEntry[];
  notifications: Notification[];
  
  // Subscription
  isSubscribed: boolean;
  trialDaysLeft: number;
  
  // Actions
  login: (phone: string, password: string) => void;
  signup: (phone: string, password: string, name: string, role: UserRole) => void;
  logout: () => void;
  setupShop: (name: string, phone: string, address?: string) => void;
  
  // Customer actions
  addCustomer: (phone: string, name: string) => void;
  
  // Baki actions
  addBaki: (customerId: string, amount: number, description?: string) => void;
  confirmBaki: (id: string) => void;
  rejectBaki: (id: string) => void;
  
  // Payment actions
  addPayment: (customerId: string, amount: number, method: PaymentMethod) => void;
  confirmPayment: (id: string) => void;
  rejectPayment: (id: string) => void;
  
  // Notification actions
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Subscription
  subscribe: () => void;
}

// Dummy data
const DUMMY_CUSTOMERS: Customer[] = [
  { id: "c1", phone: "01712345678", name: "আব্দুল করিম", balance: 2500, lastTransaction: new Date(2026, 0, 14), createdAt: new Date(2025, 10, 1) },
  { id: "c2", phone: "01812345678", name: "মোহাম্মদ হাসান", balance: 1800, lastTransaction: new Date(2026, 0, 13), createdAt: new Date(2025, 10, 5) },
  { id: "c3", phone: "01912345678", name: "ফাতেমা বেগম", balance: 3200, lastTransaction: new Date(2026, 0, 12), createdAt: new Date(2025, 10, 10) },
  { id: "c4", phone: "01612345678", name: "রহিম উদ্দিন", balance: 950, lastTransaction: new Date(2026, 0, 11), createdAt: new Date(2025, 11, 1) },
  { id: "c5", phone: "01512345678", name: "সালমা খাতুন", balance: 4100, lastTransaction: new Date(2026, 0, 10), createdAt: new Date(2025, 11, 15) },
];

const DUMMY_BAKI_ENTRIES: BakiEntry[] = [
  { id: "b1", customerId: "c1", customerName: "আব্দুল করিম", amount: 500, description: "চাল ৫ কেজি", status: "pending", createdAt: new Date(2026, 0, 15) },
  { id: "b2", customerId: "c2", customerName: "মোহাম্মদ হাসান", amount: 300, description: "তেল ২ লিটার", status: "confirmed", createdAt: new Date(2026, 0, 14), confirmedAt: new Date(2026, 0, 14) },
  { id: "b3", customerId: "c3", customerName: "ফাতেমা বেগম", amount: 1200, description: "মাসিক বাজার", status: "pending", createdAt: new Date(2026, 0, 13) },
  { id: "b4", customerId: "c1", customerName: "আব্দুল করিম", amount: 800, description: "চিনি, ডাল", status: "confirmed", createdAt: new Date(2026, 0, 12), confirmedAt: new Date(2026, 0, 12) },
  { id: "b5", customerId: "c4", customerName: "রহিম উদ্দিন", amount: 450, description: "দুধ, ডিম", status: "rejected", createdAt: new Date(2026, 0, 11) },
];

const DUMMY_PAYMENTS: PaymentEntry[] = [
  { id: "p1", customerId: "c2", customerName: "মোহাম্মদ হাসান", amount: 1000, method: "bkash", status: "pending", createdAt: new Date(2026, 0, 15) },
  { id: "p2", customerId: "c3", customerName: "ফাতেমা বেগম", amount: 500, method: "cash", status: "confirmed", createdAt: new Date(2026, 0, 14), confirmedAt: new Date(2026, 0, 14) },
  { id: "p3", customerId: "c1", customerName: "আব্দুল করিম", amount: 800, method: "nagad", status: "confirmed", createdAt: new Date(2026, 0, 13), confirmedAt: new Date(2026, 0, 13) },
];

const DUMMY_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "নতুন বাকি", message: "আব্দুল করিম এর ৳৫০০ বাকি পেন্ডিং", type: "baki", read: false, createdAt: new Date(2026, 0, 15) },
  { id: "n2", title: "পেমেন্ট পেন্ডিং", message: "মোহাম্মদ হাসান ৳১০০০ পেমেন্ট করেছে", type: "payment", read: false, createdAt: new Date(2026, 0, 15) },
  { id: "n3", title: "বাকি নিশ্চিত", message: "মোহাম্মদ হাসান এর ৳৩০০ বাকি নিশ্চিত হয়েছে", type: "baki", read: true, createdAt: new Date(2026, 0, 14) },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>("dokandar");
  
  // Data state
  const [customers, setCustomers] = useState<Customer[]>(DUMMY_CUSTOMERS);
  const [bakiEntries, setBakiEntries] = useState<BakiEntry[]>(DUMMY_BAKI_ENTRIES);
  const [payments, setPayments] = useState<PaymentEntry[]>(DUMMY_PAYMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS);
  
  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const trialDaysLeft = 25;
  
  // Auth actions
  const login = useCallback((phone: string, _password: string) => {
    setIsAuthenticated(true);
    setUserProfile({
      id: "u1",
      name: currentRole === "dokandar" ? "রহিম স্টোর" : "আব্দুল করিম",
      phone,
      role: currentRole,
    });
    if (currentRole === "dokandar") {
      setHasShop(true);
      setShop({
        id: "s1",
        name: "রহিম স্টোর",
        phone,
        address: "মিরপুর, ঢাকা",
      });
    }
  }, [currentRole]);
  
  const signup = useCallback((phone: string, _password: string, name: string, role: UserRole) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    setUserProfile({
      id: "u1",
      name,
      phone,
      role,
    });
    if (role === "dokandar") {
      setHasShop(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setHasShop(false);
    setUserProfile(null);
    setShop(null);
  }, []);
  
  const setupShop = useCallback((name: string, phone: string, address?: string) => {
    setShop({
      id: "s1",
      name,
      phone,
      address,
    });
    setHasShop(true);
  }, []);
  
  const switchRole = useCallback((role: UserRole) => {
    setCurrentRole(role);
    if (isAuthenticated && userProfile) {
      setUserProfile({
        ...userProfile,
        role,
        name: role === "dokandar" ? "রহিম স্টোর" : "আব্দুল করিম",
      });
    }
  }, [isAuthenticated, userProfile]);
  
  // Customer actions
  const addCustomer = useCallback((phone: string, name: string) => {
    const newCustomer: Customer = {
      id: `c${Date.now()}`,
      phone,
      name,
      balance: 0,
      createdAt: new Date(),
    };
    setCustomers(prev => [newCustomer, ...prev]);
  }, []);
  
  // Baki actions
  const addBaki = useCallback((customerId: string, amount: number, description?: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const newBaki: BakiEntry = {
      id: `b${Date.now()}`,
      customerId,
      customerName: customer.name,
      amount,
      description,
      status: "pending",
      createdAt: new Date(),
    };
    setBakiEntries(prev => [newBaki, ...prev]);
    
    // Add notification
    const newNotification: Notification = {
      id: `n${Date.now()}`,
      title: "নতুন বাকি",
      message: `${customer.name} এর ৳${amount} বাকি যোগ হয়েছে`,
      type: "baki",
      read: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, [customers]);
  
  const confirmBaki = useCallback((id: string) => {
    setBakiEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, status: "confirmed" as EntryStatus, confirmedAt: new Date() }
        : entry
    ));
    
    // Update customer balance
    const entry = bakiEntries.find(e => e.id === id);
    if (entry) {
      setCustomers(prev => prev.map(c => 
        c.id === entry.customerId
          ? { ...c, balance: c.balance + entry.amount, lastTransaction: new Date() }
          : c
      ));
    }
  }, [bakiEntries]);
  
  const rejectBaki = useCallback((id: string) => {
    setBakiEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, status: "rejected" as EntryStatus }
        : entry
    ));
  }, []);
  
  // Payment actions
  const addPayment = useCallback((customerId: string, amount: number, method: PaymentMethod) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const newPayment: PaymentEntry = {
      id: `p${Date.now()}`,
      customerId,
      customerName: customer.name,
      amount,
      method,
      status: "pending",
      createdAt: new Date(),
    };
    setPayments(prev => [newPayment, ...prev]);
    
    // Add notification
    const newNotification: Notification = {
      id: `n${Date.now()}`,
      title: "নতুন পেমেন্ট",
      message: `${customer.name} এর ৳${amount} পেমেন্ট পেন্ডিং`,
      type: "payment",
      read: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, [customers]);
  
  const confirmPayment = useCallback((id: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === id 
        ? { ...payment, status: "confirmed" as EntryStatus, confirmedAt: new Date() }
        : payment
    ));
    
    // Update customer balance
    const payment = payments.find(p => p.id === id);
    if (payment) {
      setCustomers(prev => prev.map(c => 
        c.id === payment.customerId
          ? { ...c, balance: c.balance - payment.amount, lastTransaction: new Date() }
          : c
      ));
    }
  }, [payments]);
  
  const rejectPayment = useCallback((id: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === id 
        ? { ...payment, status: "rejected" as EntryStatus }
        : payment
    ));
  }, []);
  
  // Notification actions
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);
  
  // Subscription
  const subscribe = useCallback(() => {
    setIsSubscribed(true);
  }, []);
  
  const value: AppContextType = {
    isAuthenticated,
    hasShop,
    userProfile,
    shop,
    currentRole,
    switchRole,
    customers,
    bakiEntries,
    payments,
    notifications,
    isSubscribed,
    trialDaysLeft,
    login,
    signup,
    logout,
    setupShop,
    addCustomer,
    addBaki,
    confirmBaki,
    rejectBaki,
    addPayment,
    confirmPayment,
    rejectPayment,
    markNotificationRead,
    clearAllNotifications,
    subscribe,
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
