import React from 'react';

const renderForecast = (forecastData, formatDate, WeatherIcon) => {
  if (!forecastData || !forecastData.list || forecastData.list.length === 0) return null;

  // Получаем текущую дату
  const today = new Date();

  // Функция для получения прогноза на определенный день
  const getForecastForDay = (date) => {
    const filteredForecast = forecastData.list.filter(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.getDate() === date.getDate();
    });

    if (filteredForecast.length === 0) return null;

    const dayForecast = filteredForecast[0];

    return (
      <div key={dayForecast.dt}>
        <h3>{date.toLocaleDateString('en-GB', { weekday: 'long' })}</h3>
        <p>Date: {formatDate(dayForecast.dt)}</p>
        <p>Temperature: {dayForecast.main.temp}°K</p>
        <p>Weather: {dayForecast.weather[0].description}</p>
        <p>Humidity: {dayForecast.main.humidity}%</p>
        <p>Wind Speed: {dayForecast.wind.speed} m/s</p>
        <WeatherIcon iconCode={dayForecast.weather[0].icon} />
      </div>
    );
  };

  // Получаем прогнозы на завтра и послезавтра
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
