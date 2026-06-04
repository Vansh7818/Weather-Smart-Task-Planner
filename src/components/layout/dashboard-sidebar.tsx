"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, Map, Activity,
  Cloud, Settings, CloudRain, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const routes = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Smart Planner", href: "/planner", icon: CalendarDays },
  { name: "Weather Map", href: "/weather", icon: Map },
  { name: "Activities", href: "/activities", icon: Activity },
  { name: "7-Day Forecast", href: "/forecast", icon: Cloud },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-64 flex-col border-r border-border/40 bg-card/30 backdrop-blur-sm shrink-0">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border/40 px-6">
        <CloudRain className="h-6 w-6 text-indigo-400" />
        <div>
          <p className="text-sm font-bold text-foreground">SmartPlanner</p>
          <p className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">AI Powered</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-3 pt-4">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
              )}
            >
              <route.icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "")} />
              {route.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      <div className="p-4 border-t border-border/40">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <p className="text-xs font-semibold text-indigo-400">AI Pro Plan</p>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Unlock real-time weather feeds and GPT-4 itineraries.</p>
          <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8">
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
