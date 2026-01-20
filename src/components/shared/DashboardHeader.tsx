"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Bell, LogOut, Settings, User, Store } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function DashboardHeader({ title, showBack }: DashboardHeaderProps) {
  const { shop, userProfile, currentRole, notifications, logout } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  const displayName = currentRole === "dokandar" ? shop?.name : userProfile?.name;

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50 safe-area-top">
      <div className="container">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side - Logo/Title */}
          <Link href={currentRole === "dokandar" ? "/dashboard" : "/customer"} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-hero flex items-center justify-center shadow-md flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm leading-tight truncate">{displayName || "লেনদেন"}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {currentRole === "dokandar" ? "দোকানদার" : "গ্রাহক"}
              </p>
            </div>
          </Link>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" asChild className="relative w-9 h-9 sm:w-10 sm:h-10">
              <Link href="/notifications">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 min-w-[18px] h-[18px] sm:min-w-5 sm:h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] sm:text-xs flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-10 sm:h-10">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {currentRole === "dokandar" ? (
                      <Store className="w-4 h-4 text-primary" />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 sm:w-56">
                <div className="px-3 py-2">
                  <p className="font-semibold text-sm sm:text-base truncate">{displayName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{userProfile?.phone}</p>
                </div>
                <DropdownMenuSeparator />
                {currentRole === "dokandar" && (
                  <DropdownMenuItem asChild>
                    <Link href="/subscription" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      সাবস্ক্রিপশন
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/" onClick={() => logout()} className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4" />
                    লগআউট
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
