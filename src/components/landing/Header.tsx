"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">লেনদেন</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              সুবিধাসমূহ
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              মূল্য
            </Link>
            <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              যোগাযোগ
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth">লগইন</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link href="/auth?mode=signup">ফ্রি শুরু করুন</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link 
                href="#features" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                সুবিধাসমূহ
              </Link>
              <Link 
                href="#pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                মূল্য
              </Link>
              <Link 
                href="#contact" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                যোগাযোগ
              </Link>
              <div className="flex flex-col gap-3 pt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth">লগইন</Link>
                </Button>
                <Button variant="hero" asChild className="w-full">
                  <Link href="/auth?mode=signup">ফ্রি শুরু করুন</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
