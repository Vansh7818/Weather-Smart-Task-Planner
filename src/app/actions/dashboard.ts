"use server";

import { verifyJWT } from "@/lib/auth-jwt";
import { cookies } from "next/headers";
import { getMockWeatherData } from "@/lib/services/weather";
import { runMLRecommendationEngine } from "@/lib/services/ml-engine";

export async function getDashboardDataAction(city: string = "San Francisco") {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) {
    return { error: "Unauthorized" };
  }

  const user = await verifyJWT(token);
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const weather = getMockWeatherData(city);
    const mlAnalysis = runMLRecommendationEngine(weather);

    return {
      success: true,
      weather,
      mlAnalysis,
      user,
    };
  } catch (error) {
    console.error("Dashboard error:", error);
    return { error: "Failed to fetch dashboard data" };
  }
}
