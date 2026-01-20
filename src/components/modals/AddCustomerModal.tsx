"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, User } from "lucide-react";

interface AddCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (phone: string, name: string) => void;
}

export default function AddCustomerModal({ open, onOpenChange, onSubmit }: AddCustomerModalProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ phone: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = { phone: "", name: "" };
    let isValid = true;

    if (!phone.match(/^01[3-9]\d{8}$/)) {
      newErrors.phone = "সঠিক ফোন নম্বর দিন";
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = "নাম আবশ্যক";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(phone, name);
    setPhone("");
    setName("");
    setErrors({ phone: "", name: "" });
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setPhone("");
    setName("");
    setErrors({ phone: "", name: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg sm:text-xl">নতুন গ্রাহক যোগ করুন</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:py-4">
          <div className="space-y-2">
            <Label htmlFor="customer-phone" className="text-sm">ফোন নম্বর *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="customer-phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                className="pl-10 h-11 sm:h-10 text-base sm:text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {errors.phone && <p className="text-xs sm:text-sm text-destructive">{errors.phone}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="text-sm">নাম *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="customer-name"
                type="text"
                placeholder="গ্রাহকের নাম"
                className="pl-10 h-11 sm:h-10 text-base sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {errors.name && <p className="text-xs sm:text-sm text-destructive">{errors.name}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="h-10 sm:h-9 text-sm">
              বাতিল
            </Button>
            <Button type="submit" variant="hero" disabled={isSubmitting} className="h-10 sm:h-9 text-sm">
              {isSubmitting ? "অপেক্ষা করুন..." : "যোগ করুন"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
