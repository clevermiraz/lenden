"use client";

import DashboardHeader from "@/components/shared/DashboardHeader";
import BottomNav from "@/components/shared/BottomNav";
import { useApp } from "@/contexts/AppContext";
import { formatRelativeTime } from "@/lib/formatters";
import { Bell, BellOff, Plus, CreditCard, Info, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "baki":
        return <Plus className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "payment":
        return <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Info className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "baki":
        return "bg-destructive/10 text-destructive";
      case "payment":
        return "bg-success/10 text-success";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl font-bold">নোটিফিকেশন</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} টি অপঠিত` : "সব পড়া হয়েছে"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllNotifications} className="h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-3 flex-shrink-0">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">সব পড়া</span>
              <span className="sm:hidden">পড়া</span>
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-card rounded-xl shadow-card border border-border/50 p-6 sm:p-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <BellOff className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <h4 className="font-display font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">কোনো নোটিফিকেশন নেই</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              নতুন নোটিফিকেশন এখানে দেখাবে
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-3 sm:p-4 flex gap-3 sm:gap-4 cursor-pointer transition-colors active:bg-secondary/50",
                  !notification.read && "bg-primary/5"
                )}
                onClick={() => markNotificationRead?.(notification.id)}
              >
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0",
                  getIconBg(notification.type)
                )}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={cn(
                      "font-medium text-sm sm:text-base",
                      !notification.read && "font-semibold"
                    )}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 sm:mt-2" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {formatRelativeTime(new Date(notification.createdAt))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
