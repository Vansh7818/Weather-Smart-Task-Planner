"use client";

import Link from "next/link";
import { Bell, Sun, Moon, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DashboardNav() {
  const [isDark, setIsDark] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-semibold">Weather SmartPlanner AI</p>
          <p className="text-xs text-muted-foreground">Predictive Analytics Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsDark(!isDark)}
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 relative" title="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <Avatar className="h-8 w-8 cursor-pointer border border-border/40">
          <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xs font-bold">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
