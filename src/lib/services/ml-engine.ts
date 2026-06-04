import { WeatherData } from "./weather";

export interface MLRecommendations {
  outdoorScore: number; // 0 - 100
  productivityScore: number; // 0 - 100
  riskIndex: number; // 0 - 100
  recommendations: string[];
  itinerary: string;
}

export function runMLRecommendationEngine(
  weather: WeatherData,
  preferences: string = ""
): MLRecommendations {
  const { temp, humidity, precipitation, windSpeed, uvIndex } = weather;

  // 1. Algorithmic scoring
  // Outdoor Score: prefers moderate temps (65-75°F), low rain, low wind
  let tempFactor = 100 - Math.abs(temp - 70) * 3;
  let rainFactor = 100 - precipitation;
  let windFactor = 100 - windSpeed * 2.5;
  let outdoorScore = Math.max(0, Math.min(100, Math.round((tempFactor + rainFactor + windFactor) / 3)));

  // Productivity Score: prefers cooler temps or rainy weather (perfect for coding indoors!)
  let productivityScore = 50;
  if (precipitation > 50) productivityScore += 30; // Rain boosts indoor focus
  if (temp > 85 || temp < 50) productivityScore += 20; // Extreme temps keep you inside
  productivityScore = Math.min(100, productivityScore);

  // Risk Index: boosts with high rain, extreme heat, or high winds
  let riskIndex = 0;
  if (precipitation > 80) riskIndex += 50; // Heavy rain / Flood warning
  if (temp > 95) riskIndex += 30; // Heatwave warning
  if (windSpeed > 25) riskIndex += 30; // High wind warnings
  riskIndex = Math.min(100, riskIndex);

  // 2. Generate structured recommendations based on thresholds
  const recommendations: string[] = [];
  
  if (outdoorScore > 75) {
    recommendations.push("Perfect day for outdoor running or hiking. Temperature and wind are optimal.");
  } else if (outdoorScore < 40) {
    recommendations.push("Outdoor activities are discouraged. Conditions are unfavorable.");
  } else {
    recommendations.push("Moderate conditions for outdoor tasks. Stay hydrated.");
  }

  if (productivityScore > 75) {
    recommendations.push("Excellent window for deep-focus work or coding sessions indoors.");
  }

  if (riskIndex > 40) {
    recommendations.push("Alert: High weather risks detected. Pack protective gear and plan travel cautiously.");
  }

  // 3. Generate detailed itinerary
  let itinerary = "";
  if (weather.condition.toLowerCase().includes("rain")) {
    itinerary = `Given the ${weather.condition} forecast in ${weather.city}, we recommend organizing an indoor-focused schedule. Utilize the peak productivity window (10 AM - 2 PM) for technical studies or coding projects. Keep outdoor commuting to a minimum.`;
  } else if (temp > 85) {
    itinerary = `Due to high heat conditions (${temp}°F) in ${weather.city}, restrict outdoor physical workouts between 12 PM - 4 PM. Early morning or late evening is ideal for any necessary travel or outdoor planning.`;
  } else {
    itinerary = `Excellent conditions expected in ${weather.city}. The temperature of ${temp}°F is ideal for hybrid planning. Schedule outdoor tasks in the morning, and deep-focus study work in the afternoon when temperature peaks.`;
  }

  if (preferences) {
    itinerary += ` Customized for your preference: "${preferences}".`;
  }

  return {
    outdoorScore,
    productivityScore,
    riskIndex,
    recommendations,
    itinerary,
  };
}
