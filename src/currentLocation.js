import React, { useState, useEffect } from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeatherData = async (lat, lon) => {
      try {
        const api_call = await fetch(
          `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
        );
        const data = await api_call.json();
        const newWeatherData = {
          lat,
          lon,
          city: data.name,
          temperatureC: Math.round(data.main.temp),
          temperatureF: Math.round(data.main.temp * 1.8 + 32),
          humidity: data.main.humidity,
          main: data.weather[0].main,
          description: data.weather[0].description,
          country: data.sys.country,
        };
        switch (newWeatherData.main) {
          case "Haze":
            newWeatherData.icon = "CLEAR_DAY";
            break;
          case "Clouds":
            newWeatherData.icon = "CLOUDY";
            break;
          case "Rain":
            newWeatherData.icon = "RAIN";
            break;
          case "Snow":
            newWeatherData.icon = "SNOW";
            break;
          case "Dust":
            newWeatherData.icon = "WIND";
            break;
          case "Drizzle":
            newWeatherData.icon = "SLEET";
            break;
          case "Fog":
          case "Smoke":
            newWeatherData.icon = "FOG";
            break;
          case "Tornado":
            newWeatherData.icon = "WIND";
            break;
          default:
            newWeatherData.icon = "CLEAR_DAY";
        }
        setWeatherData(newWeatherData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
      }
    };

    const getForecastData = async (lat, lon) => {
      try {
        const api_call = await fetch(
          `${apiKeys.base}forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
        );
        const data = await api_call.json();
        const forecastList = data.list.slice(0, 5).map((item) => ({
          date: item.dt_txt,
          temperature: Math.round(item.main.temp),
          weather: item.weather[0].main,
          description: item.weather[0].description,
          tempMax: Math.round(item.main.temp_max),
          tempMin: Math.round(item.main.temp_min),
        }));
        setForecastData(forecastList);
      } catch (error) {
        console.error("Error fetching forecast data: ", error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            getWeatherData(latitude, longitude);
            getForecastData(latitude, longitude);
          },
          (error) => {
            getWeatherData(28.67, 77.22); 
            getForecastData(28.67, 77.22);
            alert(
              "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
            );
          }
        );
      } else {
        alert("Geolocation not available");
      }
    };

    getLocation();

    const interval = setInterval(() => {
      getWeatherData(weatherData?.lat, weatherData?.lon);
      getForecastData(weatherData?.lat, weatherData?.lon);
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !weatherData || !forecastData.length) {
    return (
      <>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          loading...  Detecting your location
        </h3>
      </>
    );
  }

  return (
    <>
      <div className="city">
        <div className="title">
          <h2>{weatherData.city}</h2>
          <h3>{weatherData.country}</h3>
        </div>
        <div className="mb-icon">
          {" "}
          <ReactAnimatedWeather
            icon={weatherData.icon}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}
          />
          <p className="wether-dec">{weatherData.description}</p>
        </div>
        <div className="date-time">
          <div className="dmy">
            <div id="txt"></div>
            <div className="current-time">
              <Clock format="HH:mm:ss" interval={1000} ticking={true} />
            </div>
            <div className="current-date">{dateBuilder(new Date())}</div>
          </div>
          <div className="temperature">
            <p>
              {weatherData.temperatureC}°<span>C</span>
            </p>
          </div>
        </div>
      </div>
        <Forcast icon={weatherData.icon} weather={weatherData.main} />
      <div className="forecast1">
        <h3>Forecast for the Next 5 Days:</h3>
        {forecastData.map((forecast, index) => (
          <div key={index} className="forecast-item">
            <p>Date: {forecast.date}</p>
            <p>Temperature: {forecast.temperature}°C</p>
            <p>High: {forecast.tempMax}°C</p>
            <p>Low: {forecast.tempMin}°C</p>
            <p>Weather: {forecast.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Weather;