import { DashboardNav } from "@/components/layout/dashboard-nav";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export const metadata = {
  title: "Dashboard | Weather SmartPlanner AI",
  description: "AI-powered weather analytics and smart planning dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
