"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowLeft, Phone, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    phone: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = { phone: '', password: '' };
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Login and get userType from response
      const userType = await login(formData.phone, formData.password);
      
      // Redirect based on userType from backend
      if (userType === 'customer') {
        router.push('/customer');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      // Error already handled in login function
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
              স্বাগতম!
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              আপনার একাউন্টে লগইন করুন
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
              {isSubmitting ? 'অপেক্ষা করুন...' : 'লগইন করুন'}
            </Button>
          </form>

          {/* Signup link */}
          <p className="text-center mt-6 sm:mt-8 text-sm sm:text-base text-muted-foreground">
            একাউন্ট নেই?{' '}
            <Link
              href="/auth/signup"
              className="text-primary font-semibold hover:underline underline-offset-4"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
