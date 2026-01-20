"use client";

import { useApp } from "@/contexts/AppContext";
import { Store, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoleSwitcher() {
  const { currentRole, switchRole } = useApp();

  return (
    <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container py-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">Demo:</span>
          <div className="bg-card rounded-lg border border-border shadow-sm p-0.5 flex gap-0.5">
            <button
              onClick={() => switchRole("dokandar")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all active:scale-95",
                currentRole === "dokandar"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Store className="w-3.5 h-3.5" />
              <span>দোকানদার</span>
            </button>
            <button
              onClick={() => switchRole("customer")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all active:scale-95",
                currentRole === "customer"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <User className="w-3.5 h-3.5" />
              <span>গ্রাহক</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
