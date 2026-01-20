"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Sparkles, X, Users, Zap, Crown } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: string;
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
    description: "শুরু করার জন্য উপযুক্ত",
    icon: <Users className="w-5 h-5" />,
    features: [
      { text: "৫ জন গ্রাহক", included: true },
      { text: "মাসে ২০ বাকি এন্ট্রি", included: true },
      { text: "দ্বিপক্ষীয় নিশ্চিতকরণ", included: true },
      { text: "বেসিক নোটিফিকেশন", included: true },
      { text: "লেজার ভিউ", included: false },
      { text: "SMS নোটিফিকেশন", included: false },
    ],
  },
  {
    id: "standard",
    name: "স্ট্যান্ডার্ড",
    price: "৳৯৯",
    description: "ছোট ব্যবসার জন্য আদর্শ",
    icon: <Zap className="w-5 h-5" />,
    popular: true,
    features: [
      { text: "৫০ জন গ্রাহক", included: true },
      { text: "সীমাহীন বাকি/পেমেন্ট এন্ট্রি", included: true },
      { text: "দ্বিপক্ষীয় নিশ্চিতকরণ", included: true },
      { text: "রিয়েল-টাইম নোটিফিকেশন", included: true },
      { text: "লেজার ভিউ", included: true },
      { text: "SMS নোটিফিকেশন", included: false },
    ],
  },
  {
    id: "premium",
    name: "প্রিমিয়াম",
    price: "৳১৯৯",
    description: "সব সুবিধা আনলিমিটেড",
    icon: <Crown className="w-5 h-5" />,
    features: [
      { text: "সীমাহীন গ্রাহক", included: true },
      { text: "সীমাহীন বাকি/পেমেন্ট এন্ট্রি", included: true },
      { text: "দ্বিপক্ষীয় নিশ্চিতকরণ", included: true },
      { text: "রিয়েল-টাইম নোটিফিকেশন", included: true },
      { text: "লেজার ভিউ", included: true },
      { text: "SMS + ২৪/৭ সাপোর্ট", included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-24 md:py-32">
      <div className="container">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            সহজ ও স্বচ্ছ <span className="text-gradient">মূল্য</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            আপনার ব্যবসার প্রয়োজন অনুযায়ী সঠিক প্ল্যান নির্বাচন করুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-card overflow-hidden transition-all ${
                plan.popular 
                  ? 'border-primary shadow-elevated ring-1 ring-primary/20 md:-mt-4 md:mb-4' 
                  : 'border-border shadow-card hover:shadow-elevated'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-2 text-xs sm:text-sm font-medium">
                  <Star className="w-3.5 h-3.5 inline mr-1" />
                  সবচেয়ে জনপ্রিয়
                </div>
              )}

              <div className="p-5 sm:p-6">
                {/* Plan header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
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
                    <li key={index} className="flex items-start gap-2">
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
                  asChild
                >
                  <Link href="/auth?mode=signup">
                    {plan.id === "free" ? "ফ্রি শুরু করুন" : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        শুরু করুন
                      </>
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8">
          ৩০ দিন ফ্রি ট্রায়াল • কোনো ক্রেডিট কার্ড লাগবে না • যেকোনো সময় বাতিল করুন
        </p>
      </div>
    </section>
  );
}
