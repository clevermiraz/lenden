"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRIAL_BANNER_DISMISSED_KEY = "trial_banner_dismissed";
const TRIAL_BANNER_DISMISS_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

interface TrialBannerProps {
  trialDaysLeft: number;
}

export default function TrialBanner({ trialDaysLeft }: TrialBannerProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed and if 3 days have passed
    const dismissedTimestamp = localStorage.getItem(TRIAL_BANNER_DISMISSED_KEY);
    
    if (!dismissedTimestamp) {
      // Never dismissed, show it
      setIsVisible(true);
      return;
    }

    const dismissedTime = parseInt(dismissedTimestamp, 10);
    const now = Date.now();
    const timeSinceDismissal = now - dismissedTime;

    // Show again if 3 days have passed
    if (timeSinceDismissal >= TRIAL_BANNER_DISMISS_DURATION) {
      setIsVisible(true);
      // Clear the dismissed timestamp so it can be dismissed again
      localStorage.removeItem(TRIAL_BANNER_DISMISSED_KEY);
    } else {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking close button
    setIsVisible(false);
    localStorage.setItem(TRIAL_BANNER_DISMISSED_KEY, Date.now().toString());
  };

  const handleClick = () => {
    router.push('/subscription');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="relative w-full p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary/20 via-primary/15 to-accent/20 border-2 border-primary/30 cursor-pointer hover:border-primary/50 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
      onClick={handleClick}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />
      
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base sm:text-lg text-foreground mb-0.5 sm:mb-1 leading-tight">
              ট্রায়াল: <span className="text-primary">{trialDaysLeft} দিন</span> বাকি
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              সাবস্ক্রাইব করুন এবং সব সুবিধা পান
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xs sm:text-sm font-semibold text-primary whitespace-nowrap hidden sm:inline-block px-3 py-1.5 rounded-lg bg-primary/10">
            সাবস্ক্রাইব →
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive flex-shrink-0 transition-colors"
            onClick={handleDismiss}
            aria-label="Close trial banner"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
