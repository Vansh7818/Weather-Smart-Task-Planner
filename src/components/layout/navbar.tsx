"use client";

import Link from "next/link";
import { Bell, Sun, CloudRain, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth";

export function Navbar() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2">
          <CloudRain className="h-6 w-6 text-primary" />
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg hidden md:inline-block">
              Weather SmartPlanner AI
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" aria-label="Toggle theme">
              <Sun className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign Out">
              <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
