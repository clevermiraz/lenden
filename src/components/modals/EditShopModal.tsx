"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

interface EditShopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shop: {
    id: number;
    name: string;
    phone_number?: string;
    address?: string;
  };
  onSuccess?: () => void;
}

export default function EditShopModal({
  open,
  onOpenChange,
  shop,
  onSuccess,
}: EditShopModalProps) {
  const [shopName, setShopName] = useState(shop.name || "");
  const [phoneNumber, setPhoneNumber] = useState(shop.phone_number || "");
  const [address, setAddress] = useState(shop.address || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ shopName?: string; phoneNumber?: string }>({});

  useEffect(() => {
    if (open) {
      setShopName(shop.name || "");
      setPhoneNumber(shop.phone_number || "");
      setAddress(shop.address || "");
      setErrors({});
    }
  }, [open, shop]);

  const validate = () => {
    const newErrors: { shopName?: string; phoneNumber?: string } = {};
    
    if (!shopName.trim()) {
      newErrors.shopName = "দোকানের নাম প্রয়োজন";
    }
    
    // Phone number validation (optional but if provided, should be valid format)
    if (phoneNumber && phoneNumber.trim()) {
      // Remove spaces, dashes, and + for validation
      const cleanedPhone = phoneNumber.replace(/[\s\-+]/g, '');
      // Should be 10-11 digits (Bangladesh phone numbers)
      if (!/^\d{10,11}$/.test(cleanedPhone)) {
        newErrors.phoneNumber = "বৈধ ফোন নম্বর লিখুন (১০-১১ সংখ্যা)";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Clean phone number (remove spaces, dashes, +)
      const cleanedPhone = phoneNumber.trim().replace(/[\s\-+]/g, '');
      
      const payload: {
        shopName: string;
        phone_number?: string | null;
        address?: string;
      } = {
        shopName: shopName.trim(),
      };
      
      // Always include phone_number in payload (even if empty to clear it)
      payload.phone_number = cleanedPhone || null;
      
      if (address.trim()) {
        payload.address = address.trim();
      }
      
      await axiosInstance.patch("/api/shops/", payload);

      toast.success("দোকান আপডেট করা হয়েছে!", {
        description: "দোকানের তথ্য সফলভাবে আপডেট করা হয়েছে।",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "আপডেট ব্যর্থ হয়েছে";
      toast.error("আপডেট ব্যর্থ", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg sm:text-xl">
            দোকান সম্পাদনা করুন
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:py-4">
          {/* Shop Name */}
          <div className="space-y-2">
            <Label className="text-sm">
              দোকানের নাম <span className="text-destructive">*</span>
            </Label>
            <Input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="দোকানের নাম লিখুন"
              className="h-11 sm:h-10 text-base sm:text-sm"
              disabled={isSubmitting}
            />
            {errors.shopName && (
              <p className="text-xs sm:text-sm text-destructive">{errors.shopName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label className="text-sm">দোকানের ফোন নম্বর</Label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="01XXXXXXXXX (ঐচ্ছিক)"
              className="h-11 sm:h-10 text-base sm:text-sm"
              disabled={isSubmitting}
            />
            {errors.phoneNumber && (
              <p className="text-xs sm:text-sm text-destructive">{errors.phoneNumber}</p>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground">
              দোকানের যোগাযোগের ফোন নম্বর (ঐচ্ছিক)
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="text-sm">ঠিকানা</Label>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="দোকানের ঠিকানা লিখুন (ঐচ্ছিক)"
              className="min-h-[80px] sm:min-h-[100px] text-base sm:text-sm resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
