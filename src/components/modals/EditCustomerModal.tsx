"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { formatPhone } from "@/lib/formatters";

interface EditCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: {
    id: number;
    name?: string;
    phone: string;
  };
  onSuccess?: () => void;
}

export default function EditCustomerModal({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: EditCustomerModalProps) {
  const [name, setName] = useState(customer.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (open) {
      setName(customer.name || "");
      setErrors({});
    }
  }, [open, customer]);

  const validate = () => {
    const newErrors: { name?: string } = {};
    
    if (name.trim().length === 0) {
      newErrors.name = "নাম প্রয়োজন";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/api/customers/${customer.id}/update/`, {
        name: name.trim(),
      });

      toast.success("গ্রাহক আপডেট করা হয়েছে!", {
        description: "গ্রাহকের তথ্য সফলভাবে আপডেট করা হয়েছে।",
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
            গ্রাহক সম্পাদনা করুন
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:py-4">
          {/* Phone Number (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm">ফোন নম্বর</Label>
            <Input
              value={formatPhone(customer.phone)}
              disabled
              className="h-11 sm:h-10 text-base sm:text-sm bg-muted cursor-not-allowed"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              ফোন নম্বর পরিবর্তন করা যায় না
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-sm">
              নাম <span className="text-destructive">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="গ্রাহকের নাম লিখুন"
              className="h-11 sm:h-10 text-base sm:text-sm"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs sm:text-sm text-destructive">{errors.name}</p>
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
