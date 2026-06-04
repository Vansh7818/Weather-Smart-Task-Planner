"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, Thermometer, Wind, Droplets, Eye, Gauge, Search, Sun, CloudRain, Snowflake, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardDataAction } from "@/app/actions/dashboard";
import { WeatherData } from "@/lib/services/weather";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const conditionIcons: Record<string, React.ReactNode> = {
  Sunny: <Sun className="h-16 w-16 text-yellow-400" />,
  Cloudy: <Cloud className="h-16 w-16 text-slate-400" />,
  Rainy: <CloudRain className="h-16 w-16 text-blue-400" />,
  Snowy: <Snowflake className="h-16 w-16 text-cyan-300" />,
  Stormy: <Zap className="h-16 w-16 text-purple-400" />,
};

export default function WeatherPage() {
  const [city, setCity] = useState("New York");
  const [searchInput, setSearchInput] = useState("New York");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (c: string) => {
    setLoading(true);
    const res = await getDashboardDataAction(c);
    if (res.weather) setWeather(res.weather as WeatherData);
    setLoading(false);
  };

  useEffect(() => { fetchWeather(city); }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) setCity(searchInput.trim());
  };

  const conditionKey = weather?.condition?.split(" ")[0] || "Sunny";
  const ConditionIcon = conditionIcons[conditionKey] || <Sun className="h-16 w-16 text-yellow-400" />;

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weather Map</h1>
          <p className="text-muted-foreground mt-1">Detailed current conditions and hourly forecast.</p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search city..." className="pl-9 w-[220px] bg-background/50 border-border/40" />
          </div>
          <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        </div>
      ) : weather && (
        <>
          {/* Hero weather card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 border-indigo-500/20 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex flex-col items-center gap-2">
                    {ConditionIcon}
                    <p className="text-lg font-semibold text-muted-foreground">{weather.condition}</p>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-5xl font-black tracking-tight">{weather.temp}°F</h2>
                    <p className="text-2xl font-semibold text-muted-foreground mt-1">{weather.city}</p>
                    <p className="text-sm text-muted-foreground mt-2">Feels like {Math.round(weather.temp - 3)}°F · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Humidity", value: `${weather.humidity}%`, icon: <Droplets className="h-4 w-4 text-blue-400" /> },
                      { label: "Wind", value: `${weather.windSpeed} mph`, icon: <Wind className="h-4 w-4 text-emerald-400" /> },
                      { label: "Visibility", value: "10 mi", icon: <Eye className="h-4 w-4 text-slate-400" /> },
                      { label: "Pressure", value: "1013 hPa", icon: <Gauge className="h-4 w-4 text-purple-400" /> },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center gap-2 p-3 rounded-lg bg-card/40 border border-border/40">
                        {stat.icon}
                        <div>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="text-sm font-semibold">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hourly forecast */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="bg-card/30 backdrop-blur-md border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Thermometer className="h-5 w-5 text-orange-400" /> Hourly Temperature Forecast</CardTitle>
                <CardDescription>Next 8 hours for {weather.city}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weather.hourlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTempW" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}°`} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                      <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} fill="url(#colorTempW)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hourly cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {weather.hourlyForecast.map((hour, i) => (
                <Card key={i} className={`bg-card/30 border-border/40 text-center p-3 ${i === 0 ? "ring-1 ring-indigo-500/40" : ""}`}>
                  <p className="text-xs text-muted-foreground">{hour.time}</p>
                  <p className="text-lg font-bold mt-1">{hour.temp}°</p>
                  <p className="text-xs text-blue-400 mt-1">{hour.precipitation}%</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
