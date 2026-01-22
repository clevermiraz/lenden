"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { formatPhone } from "@/lib/formatters";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    phone: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  onSuccess?: () => void;
}

export default function EditProfileModal({
  open,
  onOpenChange,
  user,
  onSuccess,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});

  useEffect(() => {
    if (open) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setErrors({});
    }
  }, [open, user]);

  const validate = () => {
    const newErrors: { firstName?: string; lastName?: string; email?: string } = {};
    
    // Email validation (optional but if provided, should be valid)
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = "বৈধ ইমেইল ঠিকানা লিখুন";
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
      await axiosInstance.patch("/api/auth/profile/", {
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        email: email.trim() || undefined,
      });

      toast.success("প্রোফাইল আপডেট করা হয়েছে!", {
        description: "আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।",
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
            প্রোফাইল সম্পাদনা করুন
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:py-4">
          {/* Phone Number (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm">ফোন নম্বর</Label>
            <Input
              value={formatPhone(user.phone)}
              disabled
              className="h-11 sm:h-10 text-base sm:text-sm bg-muted cursor-not-allowed"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              ফোন নম্বর পরিবর্তন করা যায় না
            </p>
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label className="text-sm">নামের প্রথম অংশ</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="নামের প্রথম অংশ"
              className="h-11 sm:h-10 text-base sm:text-sm"
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <p className="text-xs sm:text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label className="text-sm">নামের শেষ অংশ</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="নামের শেষ অংশ (ঐচ্ছিক)"
              className="h-11 sm:h-10 text-base sm:text-sm"
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <p className="text-xs sm:text-sm text-destructive">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm">ইমেইল</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ইমেইল ঠিকানা (ঐচ্ছিক)"
              className="h-11 sm:h-10 text-base sm:text-sm"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-xs sm:text-sm text-destructive">{errors.email}</p>
            )}
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
