import React from 'react';
import getTemperatureClass from './getTemperatureClass'; // Импорт функции

const renderForecast = (forecastData, formatDate, WeatherIcon, kelvinToCelsius) => {
  if (!forecastData || !forecastData.list || forecastData.list.length === 0) return null;

  const today = new Date();

  const getForecastForDay = (date) => {
    const filteredForecast = forecastData.list.filter(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.getDate() === date.getDate();
    });

    if (filteredForecast.length === 0) return null;

    const dayForecast = filteredForecast[0];

    return (
      <div key={dayForecast.dt} className={`forecast-day ${getTemperatureClass(kelvinToCelsius(dayForecast.main.temp))}`}>
        <h3>{date.toLocaleDateString('en-GB', { weekday: 'long' })}</h3>
        <p>Date: {formatDate(dayForecast.dt)}</p>
        <p>Temperature: {kelvinToCelsius(dayForecast.main.temp)}°C</p>
        <p>Weather: {dayForecast.weather[0].description}</p>
        <p>Humidity: {dayForecast.main.humidity}%</p>
        <p>Wind Speed: {dayForecast.wind.speed} m/s</p>
        <WeatherIcon iconCode={dayForecast.weather[0].icon} />
      </div>
    );
  };

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const afterTomorrow = new Date(today);
  afterTomorrow.setDate(today.getDate() + 2);

  const tomorrowForecast = getForecastForDay(tomorrow);
  const afterTomorrowForecast = getForecastForDay(afterTomorrow);

  return (
    <div>
      {tomorrowForecast}
      {afterTomorrowForecast}
    </div>
  );
};

export default renderForecast;
