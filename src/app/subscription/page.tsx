"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/shared/DashboardHeader";
import BottomNav from "@/components/shared/BottomNav";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Sparkles, 
  Crown,
  Zap,
  Shield,
  Clock,
  X,
  Users,
  Bell,
  FileText,
  Headphones
} from "lucide-react";
import { toast } from "sonner";

type PlanType = "free" | "standard" | "premium";

interface Plan {
  id: PlanType;
  name: string;
  price: string;
  priceNum: number;
  description: string;
  features: { text: string; included: boolean }[];
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "ফ্রি",
    price: "৳০",
    priceNum: 0,
    description: "শুরু করার জন্য উপযুক্ত",
    icon: <Users className="w-5 h-5" />,
    features: [
      { text: "৫ জন গ্রাহক", included: true },
      { text: "মাসে ২০ বাকি এন্ট্রি", included: true },
      { text: "মাসে ২০ পেমেন্ট এন্ট্রি", included: true },
      { text: "দ্বিপক্ষীয় নিশ্চিতকরণ", included: true },
      { text: "বেসিক নোটিফিকেশন", included: true },
      { text: "লেজার ভিউ", included: false },
      { text: "SMS নোটিফিকেশন", included: false },
      { text: "প্রায়োরিটি সাপোর্ট", included: false },
    ],
  },
  {
    id: "standard",
    name: "স্ট্যান্ডার্ড",
    price: "৳৯৯",
    priceNum: 99,
    description: "ছোট ব্যবসার জন্য আদর্শ",
    icon: <Zap className="w-5 h-5" />,
    popular: true,
    features: [
      { text: "৫০ জন গ্রাহক", included: true },
      { text: "সীমাহীন বাকি এন্ট্রি", included: true },
      { text: "সীমাহীন পেমেন্ট এন্ট্রি", included: true },
      { text: "দ্বিপক্ষীয় নিশ্চিতকরণ", included: true },
      { text: "রিয়েল-টাইম নোটিফিকেশন", included: true },
      { text: "লেজার ভিউ", included: true },
      { text: "SMS নোটিফিকেশন", included: false },
      { text: "প্রায়োরিটি সাপোর্ট", included: false },
    ],
  },
  {
    id: "premium",
    name: "প্রিমিয়াম",
    price: "৳১৯৯",
    priceNum: 199,
    description: "সব সুবিধা আনলিমিটেড",
    icon: <Crown className="w-5 h-5" />,
    features: [
      { text: "সীমাহীন গ্রাহক", included: true },
      { text: "সীমাহীন বাকি এন্ট্রি", included: true },
      { text: "সীমাহীন পেমেন্ট এন্ট্রি", included: true },
      { text: "দ্বিপক্ষীয় নিশ্চিতকরণ", included: true },
      { text: "রিয়েল-টাইম নোটিফিকেশন", included: true },
      { text: "লেজার ভিউ", included: true },
      { text: "SMS নোটিফিকেশন", included: true },
      { text: "২৪/৭ প্রায়োরিটি সাপোর্ট", included: true },
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { isSubscribed, trialDaysLeft } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    setSelectedPlan(plan.id);
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Subscription functionality not yet implemented
    // subscribe();
    toast.success("সাবস্ক্রিপশন সফল!", {
      description: `আপনি এখন ${plan.name} প্ল্যানে আছেন।`,
    });
    setIsProcessing(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="w-4 h-4" />
          ফিরে যান
        </Button>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-accent/10 text-accent mb-3 sm:mb-4">
            {isSubscribed ? (
              <>
                <Crown className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">প্রিমিয়াম সদস্য</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">ট্রায়াল: {trialDaysLeft} দিন বাকি</span>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">আপনার প্ল্যান বেছে নিন</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            আপনার ব্যবসার প্রয়োজন অনুযায়ী সঠিক প্ল্যান নির্বাচন করুন
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-card overflow-hidden transition-all ${
                plan.popular 
                  ? 'border-primary shadow-elevated ring-1 ring-primary/20' 
                  : 'border-border shadow-card hover:shadow-elevated'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1.5 text-xs sm:text-sm font-medium">
                  <Star className="w-3.5 h-3.5 inline mr-1" />
                  সবচেয়ে জনপ্রিয়
                </div>
              )}

              <div className={`p-4 sm:p-6 ${plan.popular ? 'pt-10 sm:pt-12' : ''}`}>
                {/* Plan header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                    plan.id === 'free' ? 'bg-muted text-muted-foreground' :
                    plan.id === 'standard' ? 'bg-primary/10 text-primary' :
                    'bg-accent/10 text-accent'
                  }`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">{plan.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 sm:mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold font-display bengali-number">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/ মাস</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-2.5">
                      {feature.included ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs sm:text-sm ${!feature.included ? 'text-muted-foreground/60' : ''}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  onClick={() => handleSubscribe(plan)}
                  disabled={isProcessing && selectedPlan === plan.id}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <>
                      <Zap className="w-4 h-4 animate-pulse" />
                      প্রসেসিং...
                    </>
                  ) : plan.priceNum === 0 ? (
                    "ফ্রি শুরু করুন"
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      সাবস্ক্রাইব করুন
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <span>১০০% নিরাপদ পেমেন্ট</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span>যেকোনো সময় বাতিল করুন</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-primary" />
            <span>বিকাশ, নগদ, কার্ড</span>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
