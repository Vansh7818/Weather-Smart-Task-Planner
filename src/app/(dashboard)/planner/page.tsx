"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, MapPin, Sparkles, Loader2, CheckCircle2, AlertCircle, CloudSun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generatePlanAction } from "@/app/actions/planner";

interface PlanResult {
  outdoorScore: number;
  productivityScore: number;
  riskIndex: number;
  recommendations: string[];
  itinerary?: string;
  advisory?: string;
}

export default function PlannerPage() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("destination", destination);
    formData.append("dates", dates);
    formData.append("preferences", preferences);

    const res = await generatePlanAction(formData);
    if (res.error) {
      setError(res.error);
    } else if (res.plan) {
      setResult(res.plan as PlanResult);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Planner</h1>
        <p className="text-muted-foreground mt-1">AI-powered itinerary generation based on real weather analytics.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Input Form */}
        <Card className="lg:col-span-2 bg-card/30 backdrop-blur-md border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-indigo-400" />
              Plan Your Trip
            </CardTitle>
            <CardDescription>Fill in the details and our ML engine will generate an optimized plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Seattle, Tokyo, Miami"
                    className="pl-9 bg-background/50 border-border/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Travel Dates</label>
                <Input
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="e.g. June 15–20, 2025"
                  className="bg-background/50 border-border/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preferences & Goals</label>
                <Textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g. outdoor hiking, museum visits, avoid rain, photography..."
                  className="bg-background/50 border-border/40 resize-none"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !destination.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Smart Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Smart Itinerary
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {!result && !error && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px] border border-dashed border-border/40 rounded-xl text-center p-8"
              >
                <CloudSun className="h-16 w-16 text-indigo-400/40 mb-4" />
                <p className="text-muted-foreground text-sm">Enter your destination and preferences to generate an AI-optimized weather-aware itinerary.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px]"
              >
                <div className="h-12 w-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4" />
                <p className="text-sm text-muted-foreground animate-pulse">Analyzing weather patterns & ML models...</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      Smart Itinerary Generated
                    </CardTitle>
                    <CardDescription>Weather-optimized plan for {destination}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Outdoor", value: result.outdoorScore, color: "text-emerald-400" },
                        { label: "Productivity", value: result.productivityScore, color: "text-indigo-400" },
                        { label: "Risk Index", value: result.riskIndex, color: "text-red-400" },
                      ].map((s) => (
                        <div key={s.label} className="text-center p-3 rounded-lg bg-card/50 border border-border/40">
                          <div className={`text-2xl font-bold ${s.color}`}>{s.value}%</div>
                          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">AI Recommendations</p>
                      {result.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>

                    {/* Itinerary */}
                    {result.itinerary && (
                      <div className="p-4 rounded-lg bg-card/50 border border-border/40">
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-indigo-400" />
                          Generated Itinerary
                        </p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{result.itinerary}</p>
                      </div>
                    )}

                    {/* Advisory */}
                    {result.advisory && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
                        ⚠️ {result.advisory}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
