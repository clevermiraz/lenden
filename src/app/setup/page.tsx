"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Store, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

export default function SetupPage() {
  const router = useRouter();
  const { setupShop } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    shopName: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    shopName: '',
    phone: '',
  });

  const validateForm = () => {
    const newErrors = { shopName: '', phone: '' };
    let isValid = true;

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'দোকানের নাম আবশ্যক';
      isValid = false;
    }

    if (!formData.phone.match(/^01[3-9]\d{8}$/)) {
      newErrors.phone = 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    setupShop(formData.shopName, formData.phone, formData.address || undefined);
    
    toast.success("দোকান সেটআপ সম্পন্ন!", {
      description: "আপনার দোকান তৈরি হয়েছে। এখন ড্যাশবোর্ডে যান।",
    });
    
    router.push('/dashboard');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center shadow-elevated">
              <Store className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
            </div>
          </div>
          
          <h1 className="font-display text-3xl font-bold mb-2">দোকান সেটআপ করুন</h1>
          <p className="text-muted-foreground">
            আপনার দোকানের তথ্য দিন। এই তথ্য গ্রাহকরা দেখবে।
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="shopName" className="text-sm font-medium">দোকানের নাম *</Label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="shopName"
                  type="text"
                  placeholder="যেমন: রহিম স্টোর"
                  className="pl-12 h-12 bg-secondary/50 border-border/50 focus:bg-card focus:border-primary transition-all"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                />
              </div>
              {errors.shopName && <p className="text-sm text-destructive">{errors.shopName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">দোকানের ফোন নম্বর *</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className="pl-12 h-12 bg-secondary/50 border-border/50 focus:bg-card focus:border-primary transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">ঠিকানা (ঐচ্ছিক)</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
                <Textarea
                  id="address"
                  placeholder="দোকানের ঠিকানা লিখুন"
                  className="pl-12 min-h-[80px] bg-secondary/50 border-border/50 focus:bg-card focus:border-primary transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'অপেক্ষা করুন...' : (
                <>
                  ড্যাশবোর্ডে যান
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          পরে আপনি সেটিংস থেকে এই তথ্য পরিবর্তন করতে পারবেন
        </p>
      </div>
    </div>
  );
}
