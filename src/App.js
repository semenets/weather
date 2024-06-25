import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cities from './cities';
import './App.css';
import renderForecast from './renderForecast';

const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputEmpty, setInputEmpty] = useState(false);
  const API_KEY = 'b7815a2894c6e8287d7f08c58c1c77fb';

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`);

      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setCity(value);
    if (value.length > 0) {
      setInputEmpty(false)
      const filtered = cities.filter((city) =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleCityClick = (cityName) => {
    setCity(cityName);
    setShowDropdown(false);
    fetchWeather(cityName);
  };

  const handleGetWeather = () => {
    if (city.trim() === '') {
      setInputEmpty(true);
    } else {
      setInputEmpty(false);
      fetchWeather(city);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const WeatherIcon = ({ iconCode }) => {
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
    return <img src={iconUrl} alt="Weather Icon" />;
  };

  return (
    <div>
      {weatherData && <h2>{weatherData.name}</h2>}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city name"
          autoComplete="off"
          name="Enter city name"
        />
        <button onClick={handleGetWeather}>Get Weather</button>
        {showDropdown && (
          <ul className='ul-list'>
            {filteredCities.map((city) => (
              <li
                className='li-item'
                key={city}
                onClick={() => handleCityClick(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {inputEmpty && <div>Please enter a city name</div>} {/* Уведомление о пустом поле ввода */}
      {weatherData && (
        <div>
          <h3>Curent weather</h3>
          <p>Date: {formatDate(weatherData.dt)}</p>
          <p>Temperature: {weatherData.main.temp}°K</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <WeatherIcon iconCode={weatherData.weather[0].icon} />
        </div>
      )}
      {forecastData && renderForecast(forecastData, formatDate, WeatherIcon)}
    </div>
  );
};

export default WeatherComponent;
