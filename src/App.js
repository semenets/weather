import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cities from './cities';
import './App.css';
import renderForecast from './renderForecast';
import getTemperatureClass from './getTemperatureClass';
import { Circles } from 'react-loader-spinner';

const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputEmpty, setInputEmpty] = useState(false);
  const API_KEY = process.env.REACT_APP_API_KEY;

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
  };

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

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);

      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
      setCity(weatherResponse.data.name);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      }, () => {
        fetchWeather('London');
      });
    } else {
      fetchWeather('London');
    }
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setCity(value);
    if (value.length > 0) {
      setInputEmpty(false);
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
      setError(false)
    } else {
      setInputEmpty(false);
      fetchWeather(city);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const WeatherIcon = ({ iconCode }) => {
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    return <img src={iconUrl} alt="Weather Icon" className="icon" />;
  };

  return (
    <div>
      {weatherData && <h2 className="city-name">{weatherData.name}</h2>}
      {!loading && (
        <div className="enter-city">
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            placeholder="Enter city name"
            autoComplete="off"
            name="Enter city name"
            className="input-field"
          />
          <button onClick={handleGetWeather}>Get weather</button>
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
      )}
      {loading && (
        <div className="loader-container">
          <Circles
            height={50}
            width={50}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='circles-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
      {error && <div className="error-text">Error: City not found</div>}
      {inputEmpty && <div className="error-text">Please enter a city name</div>}
      <div className="container-weather">
      {weatherData && (
        <div className={`weather-column weather-today ${getTemperatureClass(kelvinToCelsius(weatherData.main.temp))}`}>
          <h3>Current weather</h3>
          <p>Date: {formatDate(weatherData.dt)}</p>
          <WeatherIcon iconCode={weatherData.weather[0].icon} />
          <p className="temperature">{kelvinToCelsius(weatherData.main.temp)}°</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
      {forecastData && renderForecast(forecastData, formatDate, WeatherIcon, kelvinToCelsius)}
      </div>
    </div>
  );
};

export default WeatherComponent;
