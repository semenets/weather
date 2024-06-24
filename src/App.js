import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cities from './cities';
import './App.css';

const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
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

  // useEffect(() => {
  //   fetchWeather(city);
  // }, [city]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setCity(value);
    if (value.length > 0) {
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

  const renderForecast = () => {
    if (!forecastData || !forecastData.list || forecastData.list.length === 0) return null;

    // Получаем прогноз на завтра и послезавтра
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const afterTomorrow = new Date(today);
    afterTomorrow.setDate(today.getDate() + 2);

    const filteredForecast = forecastData.list.filter(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.getDate() === tomorrow.getDate() || itemDate.getDate() === afterTomorrow.getDate();
    });

    if (filteredForecast.length < 2) return null;

    const tomorrowForecast = filteredForecast.find(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.getDate() === tomorrow.getDate();
    });

    const afterTomorrowForecast = filteredForecast.find(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.getDate() === afterTomorrow.getDate();
    });

    return (
      <div>
        
        {tomorrowForecast && (
          <div>
            <h3>Tomorrow</h3>
            <p>Date: {formatDate(tomorrowForecast.dt)}</p>
            <p>Temperature: {tomorrowForecast.main.temp}°K</p>
            <p>Weather: {tomorrowForecast.weather[0].description}</p>
            <WeatherIcon iconCode={tomorrowForecast.weather[0].icon} />
          </div>
        )}
        {afterTomorrowForecast && (
          <div>
            <h3>Day after tomorrow</h3>
            <p>Date: {formatDate(afterTomorrowForecast.dt)}</p>
            <p>Temperature: {afterTomorrowForecast.main.temp}°K</p>
            <p>Weather: {afterTomorrowForecast.weather[0].description}</p>
            <WeatherIcon iconCode={afterTomorrowForecast.weather[0].icon} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Weather App</h1>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city name"
          autoComplete="off"
        />
        <button onClick={() => fetchWeather(city)}>Get Weather</button>
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
      {weatherData && (
        <div>
          <h2>Current Weather</h2>
          <p>Date: {formatDate(weatherData.dt)}</p>
          <p>Temperature: {weatherData.main.temp}°K</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <WeatherIcon iconCode={weatherData.weather[0].icon} />
        </div>
      )}
      {renderForecast()}
    </div>
  );
};

export default WeatherComponent;
