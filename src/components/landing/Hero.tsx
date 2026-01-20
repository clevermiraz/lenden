"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Smartphone, CheckCircle, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient mesh */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        {/* Floating blobs - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-32 -left-20 w-80 h-80 bg-primary/8 rounded-full blur-3xl blob" />
        <div className="hidden sm:block absolute top-60 right-0 w-96 h-96 bg-accent/8 rounded-full blur-3xl blob float-delayed" />
        <div className="hidden sm:block absolute bottom-20 left-1/3 w-72 h-72 bg-primary-glow/6 rounded-full blur-3xl float" />
        
        {/* Grid pattern - hidden on mobile */}
        <div 
          className="hidden sm:block absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container relative z-10 py-8 sm:py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero content */}
          <div className="text-center mb-10 sm:mb-16">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-card border border-border shadow-card mb-6 sm:mb-8 animate-fade-up">
              {/* User avatars */}
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div 
                    key={i} 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary-glow border-2 border-card flex items-center justify-center text-[10px] sm:text-xs font-medium text-primary-foreground"
                  >
                    {['ম', 'র', 'ক', 'আ'][i-1]}
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm sm:text-base font-semibold text-foreground leading-tight">১০০০+ দোকানদার</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">ইতিমধ্যে ব্যবহার করছেন</span>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                ))}
              </div>
            </div>

            {/* Main heading */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-up leading-tight" style={{ animationDelay: '0.1s' }}>
              <span className="text-foreground">ডিজিটাল </span>
              <span className="text-gradient">বাকি খাতা</span>
              <br />
              <span className="text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">যা আপনি বিশ্বাস করতে পারেন</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-up leading-relaxed px-2" style={{ animationDelay: '0.2s' }}>
              দোকানদার ও গ্রাহক উভয়ই বাকি ও পেমেন্ট নিশ্চিত করে। 
              <span className="text-foreground font-medium"> মাসিক হিসাব নিয়ে আর ঝগড়া নয়।</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Button 
                variant="hero" 
                size="xl" 
                asChild
                className="w-full sm:w-auto group min-h-[52px]"
              >
                <Link href="/auth?mode=signup">
                  বিনামূল্যে শুরু করুন
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                asChild
                className="w-full sm:w-auto border-2 min-h-[52px]"
              >
                <Link href="/auth">লগইন করুন</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '0.35s' }}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>১০০% নিরাপদ</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent" />
                <span>৩০ দিন ফ্রি ট্রায়াল</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>কোনো ক্রেডিট কার্ড লাগবে না</span>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <FeatureCard
              icon={<Users className="w-5 sm:w-6 h-5 sm:h-6" />}
              title="সহজ গ্রাহক ব্যবস্থাপনা"
              description="ফোন নম্বর দিয়ে গ্রাহক যোগ করুন, ব্যালেন্স দেখুন"
              gradient="from-primary/10 to-primary-glow/10"
              iconBg="bg-primary/15 text-primary"
            />
            <FeatureCard
              icon={<Shield className="w-5 sm:w-6 h-5 sm:h-6" />}
              title="দ্বিপক্ষীয় নিশ্চিতকরণ"
              description="গ্রাহক ও দোকানদার উভয়ই এন্ট্রি নিশ্চিত করে"
              gradient="from-accent/10 to-warning/10"
              iconBg="bg-accent/15 text-accent"
            />
            <FeatureCard
              icon={<Smartphone className="w-5 sm:w-6 h-5 sm:h-6" />}
              title="মোবাইল ফ্রেন্ডলি"
              description="যেকোনো ডিভাইসে সহজে ব্যবহার করুন"
              gradient="from-success/10 to-primary/10"
              iconBg="bg-success/15 text-success"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient,
  iconBg 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
  iconBg: string;
}) {
  return (
    <div className={`group relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-border/50 hover:border-primary/30 transition-all duration-300 card-hover`}>
      {/* Glass overlay */}
      <div className="absolute inset-0 rounded-2xl glass-card opacity-50" />
      
      <div className="relative z-10 flex sm:block items-center gap-4">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${iconBg} flex items-center justify-center sm:mb-4 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <h3 className="font-display font-semibold text-base sm:text-lg mb-1 sm:mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
