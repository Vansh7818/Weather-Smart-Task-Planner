import streamlit as st
import requests
import pandas as pd
from datetime import datetime

# 🔑 Your API Key
API_KEY = "5150914577aa0472b87ed56b6faea42d"

# ---------------------------
# Fetch Weather Data
# ---------------------------
def get_weather(city):
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    return response.json()

# ---------------------------
# Severe Weather Detection
# ---------------------------
def check_severe_weather(weather_data):
    for forecast in weather_data["list"]:
        condition = forecast["weather"][0]["main"]
        wind_speed = forecast["wind"]["speed"]
        rain_prob = forecast.get("pop", 0)

        if condition in ["Thunderstorm", "Tornado"]:
            return True
        if wind_speed > 15:
            return True
        if rain_prob > 0.8:
            return True
    return False

# ---------------------------
# Comfort Score Engine
# ---------------------------
def calculate_score(forecast):
    temp = forecast["main"]["temp"]
    rain_prob = forecast.get("pop", 0)
    wind_speed = forecast["wind"]["speed"]
    condition = forecast["weather"][0]["main"]

    score = 0

    # Temperature score
    if 18 <= temp <= 26:
        score += 40
    elif 15 <= temp <= 30:
        score += 25
    else:
        score += 10

    # Rain score
    score += (1 - rain_prob) * 30

    # Wind score
    if wind_speed < 8:
        score += 20
    elif wind_speed < 15:
        score += 10

    # Weather condition score
    if condition == "Clear":
        score += 10
    elif condition == "Clouds":
        score += 5

    return score

# ---------------------------
# Smart Planner
# ---------------------------
def smart_schedule(weather_data, tasks):
    results = []

    for task_name, task_type in tasks:

        if task_type == "Indoor":
            results.append({
                "task": task_name,
                "message": "🏠 Indoor activity — can be done anytime.",
                "reason": ["Indoor activity — not weather dependent"]
            })
            continue

        best_forecast = None
        best_score = -1

        for forecast in weather_data["list"]:
            hour = datetime.strptime(forecast["dt_txt"], "%Y-%m-%d %H:%M:%S").hour
            
            if 6 <= hour <= 20:
                score = calculate_score(forecast)

                if score > best_score:
                    best_score = score
                    best_forecast = forecast

        if best_forecast:
            temp = best_forecast["main"]["temp"]
            condition = best_forecast["weather"][0]["main"]
            wind = best_forecast["wind"]["speed"]
            rain_prob = best_forecast.get("pop", 0)
            time = best_forecast["dt_txt"]

            reasoning = [
                "Outdoor activity detected",
                f"Comfort Score: {round(best_score,2)}",
                f"Rain probability: {round(rain_prob*100)}%",
                f"Temperature: {temp}°C",
                f"Wind speed: {wind} m/s",
                f"Weather condition: {condition}"
            ]

            results.append({
                "task": task_name,
                "message": f"✅ {task_name} scheduled at {time} ({condition}, {temp}°C)",
                "reason": reasoning
            })

    return results

# ---------------------------
# Streamlit UI
# ---------------------------
st.title("🌦 AI Weather-Smart Task Planner")

city = st.text_input("Enter Your City")

task_input = st.text_area(
    "Enter Tasks (TaskName, Indoor/Outdoor)\nExample:\nJogging, Outdoor\nReading, Indoor"
)

if st.button("Generate Smart Plan"):

    if city and task_input:
        weather_data = get_weather(city)

        if weather_data.get("cod") != "200":
            st.error("Invalid City Name or API Key Issue.")
        else:

            if check_severe_weather(weather_data):
                st.error("⚠ Severe weather detected in forecast. Outdoor activities may be unsafe.")

            # Weather Summary
            temps = [item["main"]["temp"] for item in weather_data["list"]]
            conditions = weather_data["list"][0]["weather"][0]["main"]

            st.subheader("🌤 Weather Summary")
            st.write(f"Overall Condition: {conditions}")
            st.write(f"🔺 Max Temp: {max(temps)}°C")
            st.write(f"🔻 Min Temp: {min(temps)}°C")

            # Temperature Graph
            df = pd.DataFrame({
                "Time": [item["dt_txt"] for item in weather_data["list"]],
                "Temperature": temps
            })
            df["Time"] = pd.to_datetime(df["Time"])
            df = df.set_index("Time")
            st.line_chart(df)

            # Task Processing
            tasks = []
            for line in task_input.split("\n"):
                if "," in line:
                    name, ttype = line.split(",")
                    tasks.append((name.strip(), ttype.strip()))

            results = smart_schedule(weather_data, tasks)

            st.subheader("📋 Smart Task Schedule")

            for res in results:
                st.write(res["message"])
                with st.expander("🧠 View AI Reasoning"):
                    for r in res["reason"]:
                        st.write("• " + r)

    else:
        st.warning("Please enter city and tasks.")
