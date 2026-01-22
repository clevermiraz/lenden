"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, FileText, Bell, CreditCard } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

const dokandarNavItems = [
  { href: "/dashboard", icon: Home, label: "হোম" },
  { href: "/customers", icon: Users, label: "গ্রাহক" },
  { href: "/ledger", icon: FileText, label: "লেজার" },
  { href: "/notifications", icon: Bell, label: "নোটিফিকেশন" },
];

const customerNavItems = [
  { href: "/customer", icon: Home, label: "হোম" },
  { href: "/ledger", icon: FileText, label: "লেজার" },
  { href: "/notifications", icon: Bell, label: "নোটিফিকেশন" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { currentRole, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = currentRole === "shop_owner" ? dokandarNavItems : customerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border/50 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.href === "/notifications" && unreadCount > 0;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[48px] px-2 py-1.5 rounded-xl transition-all active:scale-95",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground active:text-foreground active:bg-secondary/80"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
