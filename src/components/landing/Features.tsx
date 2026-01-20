"use client";

import { 
  UserPlus, 
  FileText, 
  Bell, 
  Shield, 
  Clock, 
  CheckCircle2,
  Smartphone,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: <UserPlus className="w-6 h-6" />,
    title: "সহজে গ্রাহক যোগ করুন",
    description: "শুধু ফোন নম্বর দিয়ে গ্রাহক যোগ করুন। নাম পরে দিলেও চলবে।",
    color: "bg-primary/15 text-primary",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "বাকি ও পেমেন্ট এন্ট্রি",
    description: "দোকানদার বাকি যোগ করে, গ্রাহক নিশ্চিত করে। পেমেন্টও একইভাবে।",
    color: "bg-accent/15 text-accent",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "দ্বিপক্ষীয় নিশ্চিতকরণ",
    description: "প্রতিটি লেনদেন দু'পক্ষই নিশ্চিত করে। মিথ্যা দাবির সুযোগ নেই।",
    color: "bg-success/15 text-success",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "রিয়েল-টাইম আপডেট",
    description: "বাকি বা পেমেন্ট যোগ হলেই গ্রাহক নোটিফিকেশন পায়।",
    color: "bg-pending/15 text-pending",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "স্মার্ট নোটিফিকেশন",
    description: "পেন্ডিং এন্ট্রি, বকেয়া রিমাইন্ডার - সব এক জায়গায়।",
    color: "bg-destructive/15 text-destructive",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "লেজার ভিউ",
    description: "সম্পূর্ণ লেনদেনের ইতিহাস এক নজরে দেখুন।",
    color: "bg-primary-glow/15 text-primary-glow",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "মোবাইল অপটিমাইজড",
    description: "ফোনে সহজে ব্যবহার করুন। কম্পিউটার লাগবে না।",
    color: "bg-warning/15 text-warning",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "সহজ বাংলা ইন্টারফেস",
    description: "পুরো অ্যাপ বাংলায়। বুঝতে কোনো সমস্যা নেই।",
    color: "bg-accent/15 text-accent",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            কেন <span className="text-gradient">লেনদেন</span> ব্যবহার করবেন?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            আপনার দোকানের বাকি হিসাব এখন হাতের মুঠোয়। দোকানদার ও গ্রাহক উভয়ের জন্যই সুবিধাজনক।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-5 sm:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${feature.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-base sm:text-lg mb-1.5 sm:mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
