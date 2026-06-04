"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Cloud, Sun, CloudRain, Wind, Droplets, Snowflake } from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardDataAction } from "@/app/actions/dashboard";
import { WeatherData } from "@/lib/services/weather";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function generateWeeklyForecast(base: WeatherData) {
  return days.map((day, i) => ({
    day,
    high: Math.round(base.temp + (Math.random() * 10 - 5)),
    low: Math.round(base.temp - 8 + (Math.random() * 6 - 3)),
    precipitation: Math.round(base.precipitation + (Math.random() * 20 - 10)),
    wind: Math.round(base.windSpeed + (Math.random() * 6 - 3)),
    condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Sunny", "Partly Cloudy", "Sunny"][i],
  }));
}

const conditionIcon = (condition: string, size = "h-8 w-8") => {
  if (condition.includes("Sunny")) return <Sun className={`${size} text-yellow-400`} />;
  if (condition.includes("Rain")) return <CloudRain className={`${size} text-blue-400`} />;
  if (condition.includes("Snow")) return <Snowflake className={`${size} text-cyan-300`} />;
  return <Cloud className={`${size} text-slate-400`} />;
};

export default function ForecastPage() {
  const [city, setCity] = useState("San Francisco");
  const [input, setInput] = useState("San Francisco");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async (c: string) => {
    setLoading(true);
    const res = await getDashboardDataAction(c);
    if (res.weather) setWeather(res.weather as WeatherData);
    setLoading(false);
  };

  useEffect(() => { fetch(city); }, [city]);

  const weekly = weather ? generateWeeklyForecast(weather) : [];

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">7-Day Forecast</h1>
          <p className="text-muted-foreground mt-1">Extended weather outlook with daily breakdowns.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) setCity(input.trim()); }} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search city..." className="pl-9 w-[220px] bg-background/50 border-border/40" />
          </div>
          <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        </div>
      ) : weather && (
        <>
          {/* Today hero */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
              <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                {conditionIcon(weather.condition, "h-20 w-20")}
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Today · {city}</p>
                  <p className="text-6xl font-black mt-1">{weather.temp}°F</p>
                  <p className="text-lg text-muted-foreground mt-1">{weather.condition}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2"><Droplets className="h-4 w-4 text-blue-400" /><span>{weather.humidity}% humidity</span></div>
                  <div className="flex items-center gap-2"><Wind className="h-4 w-4 text-emerald-400" /><span>{weather.windSpeed} mph</span></div>
                  <div className="flex items-center gap-2"><CloudRain className="h-4 w-4 text-sky-400" /><span>{weather.precipitation}% rain</span></div>
                  <div className="flex items-center gap-2"><Sun className="h-4 w-4 text-orange-400" /><span>UV {weather.uvIndex}</span></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 7-day grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekly.map((d, i) => (
              <motion.div key={d.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className={`bg-card/30 border-border/40 text-center p-4 hover:border-indigo-500/30 transition-colors ${i === 0 ? "ring-1 ring-indigo-500/30" : ""}`}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">{d.day}</p>
                  <div className="flex justify-center my-3">{conditionIcon(d.condition, "h-8 w-8")}</div>
                  <p className="text-xs text-muted-foreground">{d.condition}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-lg font-bold">{d.high}°</p>
                    <p className="text-sm text-muted-foreground">{d.low}°</p>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-400">
                    <CloudRain className="h-3 w-3" />{d.precipitation}%
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Hourly forecast */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="bg-card/30 backdrop-blur-md border-border/40">
              <CardHeader>
                <CardTitle>Today&apos;s Hourly Breakdown</CardTitle>
                <CardDescription>Temperature and precipitation probability by hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {weather.hourlyForecast.map((h, i) => (
                    <div key={i} className="shrink-0 text-center p-3 rounded-xl bg-card/50 border border-border/40 w-20">
                      <p className="text-xs text-muted-foreground">{h.time}</p>
                      <div className="flex justify-center my-2">{conditionIcon("Sunny", "h-5 w-5")}</div>
                      <p className="font-bold">{h.temp}°</p>
                      <p className="text-xs text-blue-400 mt-1">{h.precipitation}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
