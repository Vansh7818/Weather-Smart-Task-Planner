"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Bike, Mountain, BookOpen, Umbrella, Coffee, Camera, Music, Dumbbell, Waves, Trees, Star, Clock } from "lucide-react";

const categories = ["All", "Outdoor", "Indoor", "Sport", "Leisure"];

const activities = [
  { name: "Mountain Hiking", category: "Outdoor", icon: Mountain, weather: "Sunny", difficulty: "Hard", duration: "4–6 hrs", rating: 4.8, color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/20", badge: "bg-emerald-500/20 text-emerald-400" },
  { name: "Cycling Tour", category: "Sport", icon: Bike, weather: "Partly Cloudy", difficulty: "Medium", duration: "2–3 hrs", rating: 4.6, color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/20", badge: "bg-blue-500/20 text-blue-400" },
  { name: "Library Research", category: "Indoor", icon: BookOpen, weather: "Any", difficulty: "Easy", duration: "1–4 hrs", rating: 4.5, color: "from-purple-500/20 to-violet-500/10", border: "border-purple-500/20", badge: "bg-purple-500/20 text-purple-400" },
  { name: "Photography Walk", category: "Leisure", icon: Camera, weather: "Golden Hour", difficulty: "Easy", duration: "1–2 hrs", rating: 4.9, color: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/20", badge: "bg-orange-500/20 text-orange-400" },
  { name: "Café Work Session", category: "Indoor", icon: Coffee, weather: "Rainy", difficulty: "Easy", duration: "2–4 hrs", rating: 4.7, color: "from-amber-500/20 to-yellow-500/10", border: "border-amber-500/20", badge: "bg-amber-500/20 text-amber-400" },
  { name: "Beach Volleyball", category: "Sport", icon: Waves, weather: "Sunny", difficulty: "Medium", duration: "1–2 hrs", rating: 4.4, color: "from-sky-500/20 to-blue-500/10", border: "border-sky-500/20", badge: "bg-sky-500/20 text-sky-400" },
  { name: "Forest Bathing", category: "Outdoor", icon: Trees, weather: "Partly Cloudy", difficulty: "Easy", duration: "1–3 hrs", rating: 4.8, color: "from-green-500/20 to-emerald-500/10", border: "border-green-500/20", badge: "bg-green-500/20 text-green-400" },
  { name: "Gym Workout", category: "Sport", icon: Dumbbell, weather: "Any", difficulty: "Hard", duration: "1–2 hrs", rating: 4.3, color: "from-red-500/20 to-rose-500/10", border: "border-red-500/20", badge: "bg-red-500/20 text-red-400" },
  { name: "Rain Day Shelter", category: "Leisure", icon: Umbrella, weather: "Rainy", difficulty: "Easy", duration: "Flexible", rating: 4.2, color: "from-slate-500/20 to-gray-500/10", border: "border-slate-500/20", badge: "bg-slate-500/20 text-slate-400" },
  { name: "Live Music Event", category: "Leisure", icon: Music, weather: "Evening", difficulty: "Easy", duration: "2–4 hrs", rating: 4.9, color: "from-pink-500/20 to-rose-500/10", border: "border-pink-500/20", badge: "bg-pink-500/20 text-pink-400" },
];

export default function ActivitiesPage() {
  const [selected, setSelected] = useState("All");

  const filtered = selected === "All" ? activities : activities.filter((a) => a.category === selected);

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
        <p className="text-muted-foreground mt-1">Weather-matched activity suggestions powered by ML suitability scoring.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selected === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelected(cat)}
            className={selected === cat ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600" : "border-border/40 text-muted-foreground hover:text-foreground"}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Activity Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={activity.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className={`bg-gradient-to-br ${activity.color} ${activity.border} border hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-xl ${activity.badge.replace("text-", "bg-").replace("/20 text-", "/10 ")}`}>
                      <Icon className={`h-6 w-6 ${activity.badge.split(" ")[1]}`} />
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-sm font-semibold">{activity.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="mt-3 text-base">{activity.name}</CardTitle>
                  <CardDescription className="text-xs">Best weather: {activity.weather}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className={`text-xs ${activity.badge}`}>{activity.category}</Badge>
                      <Badge variant="secondary" className="text-xs bg-muted/50">{activity.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
