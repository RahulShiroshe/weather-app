import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

const Forcast = ({ icon }) => {
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `${apiKeys.base}weather?q=${city}&units=metric&APPID=${apiKeys.key}`
      );
      setWeather(response.data);
    } catch (error) {
      setError({ message: "Not Found", query: city });
      console.error("Error fetching weather: ", error);
    }
  };

  useEffect(() => {
    fetchWeather("Mumbai");
  }, []);

  return (
    <div className="forecast">
      <div className="forecast-icon">
      </div>
      <div className="today-weather">
        <h3>{weather?.weather[0]?.main}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={() => fetchWeather(query)}
            />
          </div>
        </div>
        <ul>
          {weather && (
            <div>
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c (
                  {weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">{Math.round(weather.visibility)} mi</span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          )}
          {error && <li>{error.query} {error.message}</li>}
        </ul>
      </div>
    </div>
  );
};

export default Forcast;
