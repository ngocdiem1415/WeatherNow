import { useState } from 'react';
import { fetchWeatherData } from '../services/WeatherService';
import { WeatherData } from '../models/WeatherData';
import { Platform, ToastAndroid, Alert } from 'react-native';

export default function useWeatherLogic() {
  // 1. State quản lý dữ liệu thời tiết và cảnh báo
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);

  // 2. Tạo URL icon thời tiết nếu có dữ liệu
  const icon = weather?.weather ? weather.weather[0].icon : '';
  const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // 3. Hàm chuyển đổi mô tả thời tiết sang tiếng Việt
  const translateWeatherDescription = (description: string) => {
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
    return translations[description ?? ''] || description;
  };

  // 4. Hiển thị thông báo cảnh báo trên Android hoặc iOS
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
    } else {
      Alert.alert('Cảnh báo thời tiết', message);
    }
  };

  // 5. Hàm kiểm tra thành phố đầu vào
  const validateCity = (name: string) => {
  setCity(name); 
  const trimmed = name.trim();
  if (trimmed === '') {
    setErrorMessage('Tên thành phố không được để trống');
  } else if (trimmed.length > 30) {
    setErrorMessage('Tên thành phố không được vượt quá 30 ký tự');
  } else {
    setErrorMessage('');
  }
};


  // 6. Gọi API thời tiết và xử lý dữ liệu + cảnh báo
  const fetchWeather = () => {
    fetchWeatherData(city)
      .then((data) => {
        setWeather(data);

        // Gọi logic kiểm tra cảnh báo
        const warningList = checkDangerousWeather(data);
        setWarnings(warningList);

        // Hiển thị cảnh báo nếu có
        warningList.forEach(showToast);

        setErrorMessage('');
      })
      .catch(() => {
        setErrorMessage('Đã xảy ra lỗi! Vui lòng thử lại.');
      });
  };

  // 7. Reset toàn bộ dữ liệu
  const resetData = () => {
    setCity('');
    setWeather(null);
    setErrorMessage('');
    setWarnings([]);
  };

  // 8. Trả ra các state và hàm cần dùng ở component
  return {
    city,
    weather,
    errorMessage,
    iconURL,
    warnings,
    validateCity,
    fetchWeather,
    resetData,
    translateWeatherDescription,
  };
}

/* =======================================
Kiểm tra thời tiết nguy hiểm
-	Nhiệt độ cao:  Delhi, Riyadh, Baghdad, Phú Quốc
-	Nhiệt độ thấp: Moscow, Reykjavik, Toronto, Ulaanbaatar 
-	Gió mạnh:  Chicago, Wellington, Punta Arenas 
-	Độ ẩm cao: Singapore, Hồ Chí Minh, Jakarta, Bangkok  
-	Độ ẩm thấp:  Phoenix, Las Vegas, Lima, Cairo 
-	Thunderstorm:  Bangkok, Manila, Kuala Lumpur 
-	Smoke/Haze:  Hà Nội, Jakarta, Delhi  
-	Mưa lớn: Mumbai, Kolkata, Hà Nội, Đà Nẵng  
* =======================================*/

const DANGEROUS_WEATHER_THRESHOLDS = {
  temperature: { high: 35, low: 10 },
  wind: { high: 20 },
  humidity: { high: 90, low: 20 },
  dangerousConditions: ['thunderstorm', 'tornado', 'hurricane', 'smoke', 'haze'],
};

// Hàm kiểm tra các điều kiện thời tiết nguy hiểm
const checkDangerousWeather = (data: WeatherData): string[] => {
  const warnings: string[] = [];

  if (data.main.temp > DANGEROUS_WEATHER_THRESHOLDS.temperature.high) {
    warnings.push(`🌡️ Nhiệt độ cao (${data.main.temp}°C) - Hạn chế ra ngoài và uống nhiều nước`);
  } else if (data.main.temp < DANGEROUS_WEATHER_THRESHOLDS.temperature.low) {
    warnings.push(`❄️ Nhiệt độ thấp (${data.main.temp}°C) - Mặc ấm khi ra ngoài`);
  }

  if (data.wind.speed > DANGEROUS_WEATHER_THRESHOLDS.wind.high) {
    warnings.push(`💨 Gió mạnh (${data.wind.speed} km/h) - Cẩn thận khi ra ngoài`);
  }

  if (data.main.humidity > DANGEROUS_WEATHER_THRESHOLDS.humidity.high) {
    warnings.push(`💧 Độ ẩm cao (${data.main.humidity}%) - Cẩn thận với các vấn đề hô hấp`);
  } else if (data.main.humidity < DANGEROUS_WEATHER_THRESHOLDS.humidity.low) {
    warnings.push(`🔥 Độ ẩm thấp (${data.main.humidity}%) - Giữ đủ nước cho cơ thể`);
  }

  const condition = data.weather[0].main.toLowerCase();
  if (DANGEROUS_WEATHER_THRESHOLDS.dangerousConditions.includes(condition)) {
    warnings.push(`⚠️ Điều kiện thời tiết nguy hiểm: ${data.weather[0].description}`);
  }

  if (condition === 'rain' && data.rain && (data.rain['1h'] || 0) > 10) {
    warnings.push(`🌧️ Mưa lớn (${data.rain['1h']}mm) - Cảnh báo ngập lụt`);
  }

  return warnings;
};
