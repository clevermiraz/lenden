"use client";

import { Button } from "@/components/ui/button";
import { Plus, UserPlus, CreditCard, FileText } from "lucide-react";

interface QuickActionsProps {
  onAddBaki: () => void;
  onAddCustomer: () => void;
  onAddPayment: () => void;
  onViewLedger: () => void;
}

export default function QuickActions({ onAddBaki, onAddCustomer, onAddPayment, onViewLedger }: QuickActionsProps) {
  const actions = [
    {
      icon: <Plus className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "বাকি যোগ",
      onClick: onAddBaki,
      variant: "hero" as const,
      className: "shadow-lg active:shadow-md",
    },
    {
      icon: <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "গ্রাহক যোগ",
      onClick: onAddCustomer,
      variant: "secondary" as const,
      className: "active:bg-primary/10 active:text-primary",
    },
    {
      icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "পেমেন্ট",
      onClick: onAddPayment,
      variant: "secondary" as const,
      className: "active:bg-success/10 active:text-success",
    },
    {
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "লেজার",
      onClick: onViewLedger,
      variant: "secondary" as const,
      className: "active:bg-accent/10 active:text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant}
          onClick={action.onClick}
          className={`flex flex-col items-center gap-1.5 sm:gap-2.5 h-auto py-3 sm:py-5 rounded-xl sm:rounded-2xl border border-border/50 transition-all duration-200 active:scale-95 ${action.className}`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-current/10 flex items-center justify-center">
            {action.icon}
          </div>
          <span className="text-[10px] sm:text-sm font-medium leading-tight text-center">{action.label}</span>
        </Button>
      ))}
    </div>
  );
}
