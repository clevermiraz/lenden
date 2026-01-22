"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowLeft, Phone, Lock, User, Store, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

type UserType = 'shop_owner' | 'customer';

function UserTypeButton({ 
  type, 
  selected, 
  onClick, 
  icon, 
  label 
}: { 
  type: string; 
  selected: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 active:scale-95 ${
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border/50 bg-secondary/30 active:border-primary/50 active:bg-secondary/50'
      }`}
    >
      <div className={`mx-auto mb-2 sm:mb-3 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
        selected ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
      }`}>
        {icon}
      </div>
      <span className={`text-xs sm:text-sm font-semibold block ${selected ? 'text-primary' : 'text-foreground'}`}>
        {label}
      </span>
    </button>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { register } = useApp();
  const [userType, setUserType] = useState<UserType>('shop_owner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
  });

  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    name: '',
  });

  const validateForm = () => {
    const newErrors = { phone: '', password: '', name: '' };
    let isValid = true;

    // Phone validation (Bangladeshi format)
    if (!formData.phone.match(/^01[3-9]\d{8}$/)) {
      newErrors.phone = 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)';
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
      isValid = false;
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'নাম আবশ্যক';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const registeredUserType = await register(formData.phone, formData.password, firstName, lastName, userType);
      
      // Wait a bit for data to be fetched
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Redirect based on user type from backend response
      if (registeredUserType === 'shop_owner') {
        router.push('/setup'); // Shop owners go to setup to create shop
      } else if (registeredUserType === 'customer') {
        router.push('/customer'); // Customers go to customer dashboard
      } else {
        // Fallback - should not happen
        router.push('/dashboard');
      }
    } catch (error) {
      // Error already handled in register function
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex relative overflow-hidden">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero-soft relative items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div 
            className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        
        <div className="text-center text-primary-foreground relative z-10 max-w-md">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <BookOpen className="w-12 h-12" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
            </div>
          </div>
          
          <h1 className="font-display text-5xl font-bold mb-4">লেনদেন</h1>
          <p className="text-xl opacity-90 mb-10 leading-relaxed">
            আপনার দোকানের বাকি হিসাব সহজ, স্বচ্ছ ও বিশ্বাসযোগ্য করুন
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-12 relative safe-area-top">
        <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4 sm:mb-6 -ml-2 text-muted-foreground hover:text-foreground h-9 text-sm"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              ফিরে যান
            </Link>
          </Button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl gradient-hero flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow-md">
                <Sparkles className="w-3 h-3 text-accent-foreground" />
              </div>
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-bold block">লেনদেন</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Digital Baki Khata</span>
            </div>
          </div>

          {/* Form header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">
              একাউন্ট খুলুন
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              নতুন একাউন্ট তৈরি করুন
            </p>
          </div>

          {/* User type selector */}
          <div className="mb-5 sm:mb-6">
            <Label className="text-sm font-medium mb-2.5 sm:mb-3 block">আপনি কে?</Label>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <UserTypeButton
                type="shop_owner"
                selected={userType === 'shop_owner'}
                onClick={() => setUserType('shop_owner')}
                icon={<Store className="w-5 h-5 sm:w-6 sm:h-6" />}
                label="দোকানদার"
              />
              <UserTypeButton
                type="customer"
                selected={userType === 'customer'}
                onClick={() => setUserType('customer')}
                icon={<User className="w-5 h-5 sm:w-6 sm:h-6" />}
                label="গ্রাহক"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">আপনার নাম</Label>
              <div className="relative">
                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  className="pl-10 sm:pl-12 h-11 sm:h-12 text-base sm:text-sm bg-secondary/50 border-border/50 focus:bg-card focus:border-primary transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              {errors.name && <p className="text-xs sm:text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">ফোন নম্বর</Label>
              <div className="relative">
                <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className="pl-10 sm:pl-12 h-11 sm:h-12 text-base sm:text-sm bg-secondary/50 border-border/50 focus:bg-card focus:border-primary transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              {errors.phone && <p className="text-xs sm:text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">পাসওয়ার্ড</Label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 sm:pl-12 h-11 sm:h-12 text-base sm:text-sm bg-secondary/50 border-border/50 focus:bg-card focus:border-primary transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              {errors.password && <p className="text-xs sm:text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full min-h-[48px] sm:min-h-[52px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'অপেক্ষা করুন...' : 'একাউন্ট খুলুন'}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center mt-6 sm:mt-8 text-sm sm:text-base text-muted-foreground">
            ইতিমধ্যে একাউন্ট আছে?{' '}
            <Link
              href="/auth/login"
              className="text-primary font-semibold hover:underline underline-offset-4"
            >
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
