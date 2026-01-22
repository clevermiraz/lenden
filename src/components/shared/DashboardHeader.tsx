"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Bell, LogOut, Settings, User, Store, Edit2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import EditShopModal from "@/components/modals/EditShopModal";
import EditProfileModal from "@/components/modals/EditProfileModal";

interface DashboardHeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function DashboardHeader({ title, showBack }: DashboardHeaderProps) {
  const { shop, userProfile, currentRole, userType, notifications, logout, refreshShop, refreshUser } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [showEditShop, setShowEditShop] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Determine if user is shop owner
  // Priority: 1. userType from backend (most reliable), 2. shop existence, 3. currentRole
  // Only show as customer if explicitly set to "customer"
  const isShopOwner = userType === "shop_owner" 
    || (userType !== "customer" && (!!shop || currentRole === "shop_owner"))
    || (userType === null && !!shop); // Handle case where userType is null but shop exists
  
  // Get display name - shop name for shop owners, user name for customers
  const displayName = isShopOwner 
    ? shop?.name || shop?.shopName || "দোকান"
    : userProfile 
      ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || userProfile.phone
      : "গ্রাহক";
  
  // Get user full name for profile menu
  const userName = userProfile 
    ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || userProfile.phone
    : "";

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50 safe-area-top">
        <div className="container">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left side - Logo/Title */}
            <Link href={isShopOwner ? "/dashboard" : "/customer"} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-hero flex items-center justify-center shadow-md flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-sm leading-tight truncate">{displayName || "লেনদেন"}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {isShopOwner ? "দোকানদার" : "গ্রাহক"}
                </p>
              </div>
            </Link>

            {/* Right side - Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" asChild className="relative w-9 h-9 sm:w-10 sm:h-10">
                <Link href="/notifications">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 min-w-[18px] h-[18px] sm:min-w-5 sm:h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] sm:text-xs flex items-center justify-center font-semibold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-10 sm:h-10">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {isShopOwner ? (
                        <Store className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 sm:w-64">
                  <div className="px-3 py-2.5">
                    {isShopOwner ? (
                      <>
                        <p className="font-semibold text-sm sm:text-base truncate">{shop?.name || shop?.shopName || "দোকান"}</p>
                        {userName && (
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{userName}</p>
                        )}
                        {userProfile?.phone && (
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{userProfile.phone}</p>
                        )}
                        {shop?.phone_number && (
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">📞 {shop.phone_number}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-sm sm:text-base truncate">{userName || "গ্রাহক"}</p>
                        {userProfile?.phone && (
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{userProfile.phone}</p>
                        )}
                      </>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {isShopOwner ? (
                    <>
                      {shop && (
                        <DropdownMenuItem onClick={() => setShowEditShop(true)} className="flex items-center gap-2 cursor-pointer">
                          <Edit2 className="w-4 h-4" />
                          দোকান সম্পাদনা
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/subscription" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="w-4 h-4" />
                          সাবস্ক্রিপশন
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => setShowEditProfile(true)} className="flex items-center gap-2 cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                        প্রোফাইল সম্পাদনা
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/" onClick={() => logout()} className="flex items-center gap-2 cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4" />
                      লগআউট
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Edit Shop Modal */}
      {shop && (
        <EditShopModal
          open={showEditShop}
          onOpenChange={setShowEditShop}
          shop={shop}
          onSuccess={() => {
            refreshShop();
          }}
        />
      )}

      {/* Edit Profile Modal */}
      {userProfile && (
        <EditProfileModal
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          user={userProfile}
          onSuccess={() => {
            refreshUser();
          }}
        />
      )}
    </>
  );
}
