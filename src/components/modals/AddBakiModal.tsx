"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Banknote, FileText } from "lucide-react";
import type { Customer } from "@/contexts/AppContext";

interface AddBakiModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (customerId: string, amount: number, description?: string) => void;
  customers: Customer[];
}

export default function AddBakiModal({ open, onOpenChange, onSubmit, customers }: AddBakiModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ customerId: "", amount: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = { customerId: "", amount: "" };
    let isValid = true;

    if (!customerId) {
      newErrors.customerId = "গ্রাহক নির্বাচন করুন";
      isValid = false;
    }

    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "সঠিক পরিমাণ দিন";
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
    
    onSubmit(customerId, Number(amount), description || undefined);
    setCustomerId("");
    setAmount("");
    setDescription("");
    setErrors({ customerId: "", amount: "" });
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setCustomerId("");
    setAmount("");
    setDescription("");
    setErrors({ customerId: "", amount: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg sm:text-xl">বাকি যোগ করুন</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:py-4">
          <div className="space-y-2">
            <Label className="text-sm">গ্রাহক নির্বাচন করুন *</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="h-11 sm:h-10 text-base sm:text-sm">
                <SelectValue placeholder="গ্রাহক নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id} className="text-sm">
                    {customer.name} ({customer.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && <p className="text-xs sm:text-sm text-destructive">{errors.customerId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="baki-amount" className="text-sm">পরিমাণ (৳) *</Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="baki-amount"
                type="number"
                placeholder="0"
                className="pl-10 h-11 sm:h-10 text-base sm:text-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
            </div>
            {errors.amount && <p className="text-xs sm:text-sm text-destructive">{errors.amount}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="baki-description" className="text-sm">বিবরণ (ঐচ্ছিক)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="baki-description"
                placeholder="যেমন: চাল ১০ কেজি, তেল ২ লিটার"
                className="pl-10 min-h-[70px] sm:min-h-[80px] text-base sm:text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
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
