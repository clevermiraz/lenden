"use client";

import { TrendingUp, Users, Clock, Sparkles } from "lucide-react";
import { formatBDT } from "@/lib/formatters";

interface BalanceCardProps {
  totalDue: number;
  totalCustomers: number;
  pendingEntries: number;
}

export default function BalanceCard({ totalDue, totalCustomers, pendingEntries }: BalanceCardProps) {
  return (
    <div className="relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl gradient-hero text-primary-foreground shadow-elevated overflow-hidden">
      {/* Decorative elements - hidden on mobile for performance */}
      <div className="hidden sm:block absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <p className="text-primary-foreground/80 text-xs sm:text-sm">মোট বাকি</p>
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold bengali-number tracking-tight truncate">
              {formatBDT(totalDue)}
            </h2>
          </div>
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0 ml-3">
            <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />} label="গ্রাহক" value={totalCustomers} />
          <StatCard icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />} label="পেন্ডিং" value={pendingEntries} highlight={pendingEntries > 0} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all ${highlight ? 'bg-accent/30' : 'bg-white/10'}`}>
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
        <span className="opacity-80">{icon}</span>
        <span className="text-xs sm:text-sm opacity-80">{label}</span>
      </div>
      <p className="font-display text-xl sm:text-2xl font-bold bengali-number">{value}</p>
    </div>
  );
}
