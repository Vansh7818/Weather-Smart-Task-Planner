"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Palette, Globe, Save, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("Weather User");
  const [email, setEmail] = useState("user@example.com");
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true, alerts: true });
  const [units, setUnits] = useState<"fahrenheit" | "celsius">("fahrenheit");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    {
      title: "Profile",
      icon: <User className="h-5 w-5 text-indigo-400" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-background/50 border-border/40 max-w-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="bg-background/50 border-border/40 max-w-sm" />
          </div>
        </div>
      ),
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5 text-amber-400" />,
      content: (
        <div className="space-y-4">
          {[
            { key: "email" as const, label: "Email Notifications", desc: "Receive daily weather summaries via email" },
            { key: "push" as const, label: "Push Notifications", desc: "Browser notifications for weather alerts" },
            { key: "weekly" as const, label: "Weekly Reports", desc: "Get a weekly ML insights digest" },
            { key: "alerts" as const, label: "Severe Weather Alerts", desc: "Instant alerts for storms & hazards" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
              </div>
              <Switch
                checked={notifications[n.key]}
                onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [n.key]: v }))}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Display & Units",
      icon: <Palette className="h-5 w-5 text-purple-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm font-medium">Temperature Unit</p>
          <div className="flex gap-2">
            {(["fahrenheit", "celsius"] as const).map((u) => (
              <Button
                key={u}
                variant={units === u ? "default" : "outline"}
                size="sm"
                onClick={() => setUnits(u)}
                className={units === u ? "bg-indigo-600 text-white" : "border-border/40"}
              >
                {u === "fahrenheit" ? "°F Fahrenheit" : "°C Celsius"}
              </Button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Location & Privacy",
      icon: <Globe className="h-5 w-5 text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Default City</label>
            <Input defaultValue="San Francisco" className="bg-background/50 border-border/40 max-w-sm" />
          </div>
          <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-sm text-muted-foreground">
            🔒 Your location data is never shared or sold. All data is processed locally.
          </div>
        </div>
      ),
    },
    {
      title: "Security",
      icon: <Shield className="h-5 w-5 text-red-400" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Change Password</label>
            <Input type="password" placeholder="New password" className="bg-background/50 border-border/40 max-w-sm" />
          </div>
          <Button variant="outline" size="sm" className="border-border/40 text-muted-foreground hover:text-foreground">
            Update Password
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and notification settings.</p>
      </div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="bg-card/30 backdrop-blur-md border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>{section.content}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
        {saved && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-400">
            Settings saved successfully.
          </motion.p>
        )}
      </div>
    </div>
  );
}
