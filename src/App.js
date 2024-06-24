import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = 'b7815a2894c6e8287d7f08c58c1c77fb';

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleButtonClick = () => {
    fetchWeather();
  };

  return (
    <div>
      <h1>Weather App</h1>
      <div>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city name"
        />
        <button onClick={handleButtonClick}>Get Weather</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {weatherData && (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°K</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <WeatherIcon iconCode={weatherData.weather[0].icon} />
        </div>
      )}
    </div>
  );
};

const WeatherIcon = ({ iconCode }) => {
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  return <img src={iconUrl} alt="Weather Icon" />;
};

export default WeatherComponent;






