"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudRain, Sun, Wind, Droplets, Sparkles, Search, ShieldAlert, Cpu } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import { getDashboardDataAction } from "@/app/actions/dashboard";
import { WeatherData } from "@/lib/services/weather";
import { MLRecommendations } from "@/lib/services/ml-engine";

export default function DashboardPage() {
  const [searchCity, setSearchCity] = useState("San Francisco");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mlData, setMlData] = useState<MLRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async (city: string) => {
    setLoading(true);
    setError(null);
    const result = await getDashboardDataAction(city);
    if (result.error) {
      setError(result.error);
    } else if (result.success && result.weather && result.mlAnalysis) {
      setWeather(result.weather as WeatherData);
      setMlData(result.mlAnalysis as MLRecommendations);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData("San Francisco");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) fetchDashboardData(searchCity);
  };

  if (loading && !weather) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center flex-col gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading weather intelligence...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text">
            Weather Intelligence Hub
          </h1>
          <p className="text-muted-foreground mt-1">Real-time predictive analytics & ML-powered insights.</p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search city... (e.g. Seattle, Miami)"
              className="pl-9 w-[260px] bg-background/50 border-border/40"
            />
          </div>
          <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {loading ? "..." : "Analyze"}
          </Button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {weather && mlData && (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Temperature",
                value: `${weather.temp}°F`,
                sub: `Condition: ${weather.condition}`,
                icon: <Sun className="h-4 w-4 text-orange-400" />,
                color: "from-orange-500/10 to-yellow-500/5",
              },
              {
                title: "Humidity",
                value: `${weather.humidity}%`,
                sub: `Precipitation: ${weather.precipitation}%`,
                icon: <Droplets className="h-4 w-4 text-blue-400" />,
                color: "from-blue-500/10 to-cyan-500/5",
              },
              {
                title: "Wind Speed",
                value: `${weather.windSpeed} mph`,
                sub: `UV Index: ${weather.uvIndex}`,
                icon: <Wind className="h-4 w-4 text-emerald-400" />,
                color: "from-emerald-500/10 to-teal-500/5",
              },
              {
                title: "Air Quality (AQI)",
                value: `${weather.aqi}`,
                sub: "Status: Good Quality",
                icon: <Cpu className="h-4 w-4 text-indigo-400" />,
                color: "from-indigo-500/10 to-purple-500/5",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className={`bg-gradient-to-br ${card.color} border-border/40 backdrop-blur-sm`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    {card.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts + ML Insights */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Temperature trend chart */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/30 backdrop-blur-md border-border/40 h-full">
                <CardHeader>
                  <CardTitle>Temperature Trend & Precipitation</CardTitle>
                  <CardDescription>Hourly forecast for {weather.city}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weather.hourlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}°`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                        />
                        <Area type="monotone" dataKey="temp" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ML Analytics */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    Predictive ML Insights
                  </CardTitle>
                  <CardDescription>Algorithmic suitability scoring models</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Outdoor Suitability", value: mlData.outdoorScore, color: "bg-emerald-500", textColor: "text-emerald-400" },
                    { label: "Indoor Focus Score", value: mlData.productivityScore, color: "bg-indigo-500", textColor: "text-indigo-400" },
                    { label: "Weather Risk Index", value: mlData.riskIndex, color: "bg-red-500", textColor: "text-red-400" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className={`font-semibold ${item.textColor}`}>{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${item.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-border/40 space-y-2">
                    {mlData.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                    {mlData.riskIndex > 30 && (
                      <div className="flex gap-2 text-sm text-red-400 items-start bg-red-500/10 border border-red-500/20 p-2.5 rounded-md">
                        <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>Risk Alert: Heightened safety precautions advised.</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Hourly Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-card/30 backdrop-blur-md border-border/40">
              <CardHeader>
                <CardTitle>Precipitation Probability by Hour</CardTitle>
                <CardDescription>Hourly rain chance forecast for {weather.city}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weather.hourlyForecast} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="time" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      />
                      <Bar dataKey="precipitation" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
