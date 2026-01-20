"use client";

import Link from "next/link";
import { BookOpen, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-card border-t border-border">
      <div className="container py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">লেনদেন</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              আপনার দোকানের বাকি হিসাব সহজ, স্বচ্ছ ও বিশ্বাসযোগ্য করুন। 
              দোকানদার ও গ্রাহক উভয়ই বাকি ও পেমেন্ট নিশ্চিত করে।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-3 sm:mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  সুবিধাসমূহ
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  মূল্য
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                  লগইন
                </Link>
              </li>
              <li>
                <Link href="/auth?mode=signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  সাইন আপ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-3 sm:mb-4">যোগাযোগ</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>০১৭১২-৩৪৫৬৭৮</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="break-all">support@lenden.com.bd</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>মিরপুর-১০, ঢাকা-১২১৬, বাংলাদেশ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; ২০২৬ লেনদেন। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
