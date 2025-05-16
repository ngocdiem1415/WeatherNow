const apiKey = 'a1a36cf6b5b66be39e5d00e7b9f1c162';

// Interface định nghĩa kiểu dữ liệu Weather
interface WeatherData {
  weather: { icon: string; description: string; main: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number; deg: number };
  name: string;
  cod: number;
  rain?: { '1h'?: number };
}

// Thêm các ngưỡng cảnh báo thời tiết nguy hiểm
const DANGEROUS_WEATHER_THRESHOLDS = {
  temperature: {
    high: 35, // Nhiệt độ cao trên 35°C
    low: 10,  // Nhiệt độ thấp dưới 10°C
  },
  wind: {
    high: 20, // Gió mạnh trên 20 km/h
  },
  humidity: {
    high: 90, // Độ ẩm cao trên 90%
    low: 20,  // Độ ẩm thấp dưới 20%
  },
  // Các điều kiện thời tiết nguy hiểm
  dangerousConditions: ['thunderstorm', 'tornado', 'hurricane', 'smoke', 'haze']
};

// Interface định nghĩa kiểu dữ liệu Weather
interface WeatherData {
  weather: { icon: string; description: string; main: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number; deg: number };
  name: string;
  cod: number;
  rain?: { '1h'?: number };
}

// Kiểm tra thời tiết nguy hiểm
export const checkDangerousWeather = (weatherData: WeatherData) => {
  const warnings = [];
  
  // Kiểm tra nhiệt độ
  if (weatherData.main.temp > DANGEROUS_WEATHER_THRESHOLDS.temperature.high) {
    warnings.push(`Nhiệt độ cao (${weatherData.main.temp}°C) - Hạn chế ra ngoài và uống nhiều nước`);
  } else if (weatherData.main.temp < DANGEROUS_WEATHER_THRESHOLDS.temperature.low) {
    warnings.push(`Nhiệt độ thấp (${weatherData.main.temp}°C) - Mặc ấm khi ra ngoài`);
  }
  
  // Kiểm tra tốc độ gió
  if (weatherData.wind.speed > DANGEROUS_WEATHER_THRESHOLDS.wind.high) {
    warnings.push(`Gió mạnh (${weatherData.wind.speed} km/h) - Cẩn thận khi ra ngoài`);
  }
  
  // Kiểm tra độ ẩm
  if (weatherData.main.humidity > DANGEROUS_WEATHER_THRESHOLDS.humidity.high) {
    warnings.push(`Độ ẩm cao (${weatherData.main.humidity}%) - Cẩn thận với các vấn đề hô hấp`);
  } else if (weatherData.main.humidity < DANGEROUS_WEATHER_THRESHOLDS.humidity.low) {
    warnings.push(`Độ ẩm thấp (${weatherData.main.humidity}%) - Giữ đủ nước cho cơ thể`);
  }
  
  // Kiểm tra điều kiện thời tiết nguy hiểm
  const weatherCondition = weatherData.weather[0].main.toLowerCase();
  if (DANGEROUS_WEATHER_THRESHOLDS.dangerousConditions.includes(weatherCondition)) {
    warnings.push(`Cảnh báo: Điều kiện thời tiết nguy hiểm (${weatherData.weather[0].description})`);
  }
  
  // Kiểm tra mưa
  if (weatherCondition === 'rain' && weatherData.rain) {
    const rainVolume = weatherData.rain['1h'] || 0;
    if (rainVolume > 10) {
      warnings.push(`Mưa lớn (${rainVolume}mm) - Cảnh báo ngập lụt`);
    }
  }
  
  return warnings;
};

export const fetchWeatherData = (city: string) => {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  return fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data)
    .catch((err) => {
      console.log("Error:", err);
      throw err;
    });
};