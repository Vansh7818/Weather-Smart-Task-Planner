export interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
  aqi: number;
  condition: string;
  hourlyForecast: { time: string; temp: number; precipitation: number }[];
  weeklyForecast: { day: string; temp: number; condition: string }[];
}

export function getMockWeatherData(city: string): WeatherData {
  const normalizedCity = city.toLowerCase().trim();

  if (normalizedCity.includes("seattle")) {
    return {
      city: "Seattle, WA",
      temp: 58,
      humidity: 82,
      windSpeed: 8,
      precipitation: 90,
      uvIndex: 2,
      aqi: 28,
      condition: "Rainy",
      hourlyForecast: [
        { time: "9 AM", temp: 56, precipitation: 80 },
        { time: "12 PM", temp: 58, precipitation: 90 },
        { time: "3 PM", temp: 60, precipitation: 75 },
        { time: "6 PM", temp: 57, precipitation: 60 },
        { time: "9 PM", temp: 54, precipitation: 40 },
      ],
      weeklyForecast: [
        { day: "Mon", temp: 58, condition: "Rainy" },
        { day: "Tue", temp: 60, condition: "Showers" },
        { day: "Wed", temp: 62, condition: "Cloudy" },
        { day: "Thu", temp: 65, condition: "Sunny" },
        { day: "Fri", temp: 59, condition: "Heavy Rain" },
      ],
    };
  }

  if (normalizedCity.includes("miami")) {
    return {
      city: "Miami, FL",
      temp: 88,
      humidity: 78,
      windSpeed: 15,
      precipitation: 40,
      uvIndex: 10,
      aqi: 45,
      condition: "Humid & Sunny",
      hourlyForecast: [
        { time: "9 AM", temp: 84, precipitation: 10 },
        { time: "12 PM", temp: 88, precipitation: 20 },
        { time: "3 PM", temp: 90, precipitation: 45 },
        { time: "6 PM", temp: 86, precipitation: 30 },
        { time: "9 PM", temp: 82, precipitation: 15 },
      ],
      weeklyForecast: [
        { day: "Mon", temp: 88, condition: "Sunny" },
        { day: "Tue", temp: 89, condition: "Sunny" },
        { day: "Wed", temp: 87, condition: "Thunderstorms" },
        { day: "Thu", temp: 88, condition: "Showers" },
        { day: "Fri", temp: 90, condition: "Sunny" },
      ],
    };
  }

  // Default: San Francisco style
  return {
    city: city ? `${city.charAt(0).toUpperCase() + city.slice(1)}` : "San Francisco, CA",
    temp: 68,
    humidity: 55,
    windSpeed: 12,
    precipitation: 10,
    uvIndex: 6,
    aqi: 35,
    condition: "Partly Cloudy",
    hourlyForecast: [
      { time: "9 AM", temp: 62, precipitation: 5 },
      { time: "12 PM", temp: 68, precipitation: 10 },
      { time: "3 PM", temp: 70, precipitation: 15 },
      { time: "6 PM", temp: 66, precipitation: 5 },
      { time: "9 PM", temp: 60, precipitation: 0 },
    ],
    weeklyForecast: [
      { day: "Mon", temp: 68, condition: "Partly Cloudy" },
      { day: "Tue", temp: 70, condition: "Sunny" },
      { day: "Wed", temp: 69, condition: "Sunny" },
      { day: "Thu", temp: 67, condition: "Cloudy" },
      { day: "Fri", temp: 65, condition: "Partly Cloudy" },
    ],
  };
}
