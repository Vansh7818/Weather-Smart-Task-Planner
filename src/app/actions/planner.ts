"use server";

import { db } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-jwt";
import { cookies } from "next/headers";
import { getMockWeatherData } from "@/lib/services/weather";
import { runMLRecommendationEngine } from "@/lib/services/ml-engine";
import { revalidatePath } from "next/cache";

export async function generatePlanAction(formData: FormData) {
  const destination = formData.get("destination") as string;
  const dates = formData.get("dates") as string;
  const preferences = formData.get("preferences") as string;

  if (!destination) {
    return { error: "Destination is required" };
  }

  // Authenticate user
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
    // 1. Get weather patterns
    const weather = getMockWeatherData(destination);

    // 2. Process weather with ML engine
    const mlAnalysis = runMLRecommendationEngine(weather, preferences);

    // 3. Save to database
    const plan = await db.plan.create({
      data: {
        title: `Trip to ${destination} (${dates || "Upcoming"})`,
        description: `Preferences: ${preferences || "None"}`,
        date: new Date(),
        type: "travel",
        aiRecommendations: JSON.stringify(mlAnalysis),
        userId: user.userId,
      },
    });

    revalidatePath("/planner");
    return { success: true, plan: mlAnalysis };
  } catch (error) {
    console.error("Failed to generate plan:", error);
    return { error: "Failed to process plan" };
  }
}
