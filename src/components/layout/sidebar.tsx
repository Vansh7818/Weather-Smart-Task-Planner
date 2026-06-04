import Link from "next/link";
import { Home, CalendarDays, Map, Activity, Settings, Cloud } from "lucide-react";

const routes = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Smart Planner", href: "/planner", icon: CalendarDays },
  { name: "Travel Map", href: "/map", icon: Map },
  { name: "Activities", href: "/activities", icon: Activity },
  { name: "Weather Data", href: "/weather", icon: Cloud },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-background/50 backdrop-blur-sm hidden md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Menu
        </span>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
          >
            <route.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{route.name}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t">
        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">Upgrade to Pro</p>
          <button className="w-full rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}
