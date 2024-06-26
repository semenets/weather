const getTemperatureClass = (temp) => {
  if (temp < -10) {
    return 'very-cold';
  } else if (temp >= -10 && temp < 0) {
    return 'cold';
  } else if (temp >= 0 && temp < 10) {
    return 'moderate';
  } else if (temp >= 10 && temp < 20) {
    return 'warm';
  } else if (temp >= 20 && temp < 30) {
    return 'hot';
  } else {
    return 'very-hot';
  }
};

export default getTemperatureClass;
