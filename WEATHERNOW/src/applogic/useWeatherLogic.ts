import { useState } from 'react';
import { fetchWeatherData } from '../services/WeatherService';

export default function useWeatherLogic() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState('');

  const icon = weather.weather ? weather.weather[0].icon : '';
  const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const translateWeatherDescription = (description?: string) => {
    if (!description) return '';
    const translations: Record<string, string> = {
      "clear sky": "trời quang đãng",
      "few clouds": "ít mây",
      "scattered clouds": "mây rải rác",
      "broken clouds": "mây che phủ",
      "shower rain": "mưa rào",
      "rain": "mưa",
      "thunderstorm": "bão có sấm",
      "snow": "tuyết",
      "mist": "sương mù",
      "overcast clouds": "mây che phủ",
    };
    return translations[description] || description;
  };

  const validateCity = (lcName: string) => {
    const trimmed = lcName.trim();
    if (trimmed === '') {
      setErrorMessage('Tên thành phố không được để trống');
    } else if (trimmed.length > 30) {
      setErrorMessage('Tên thành phố không được vượt quá 30 ký tự');
    } else {
      setErrorMessage('');
      setCity(lcName);
    }
  };

  const fetchWeather = () => {
    fetchWeatherData(city)
      .then((data) => {
        setWeather(data);
        setErrorMessage('');
      })
      .catch(() => {
        setErrorMessage('Đã xảy ra lỗi! Vui lòng thử lại.');
      });
  };

  const resetData = () => {
    setCity('');
    setWeather({});
    setErrorMessage('');
  };

  return {
    city,
    weather,
    errorMessage,
    iconURL,
    validateCity,
    fetchWeather,
    resetData,
    translateWeatherDescription,
  };
}
