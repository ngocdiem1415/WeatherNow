import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ToastAndroid, Platform, Alert } from 'react-native';
import WeatherInfo from './WeatherInfo';
import { fetchWeatherData, checkDangerousWeather } from '../services/WeatherAPI';

/* test
Nhiệt độ cao	Delhi, Riyadh, Baghdad, Phú Quốc (trưa)	
Nhiệt độ thấp	Moscow, Reykjavik, Toronto, Ulaanbaatar	
Gió mạnh	Chicago, Wellington, Punta Arenas	
Độ ẩm cao	Singapore, Hồ Chí Minh, Jakarta, Bangkok	
Độ ẩm thấp	Phoenix, Las Vegas, Lima, Cairo	
Thunderstorm	Bangkok, Manila, Kuala Lumpur	
Smoke/Haze	Hà Nội, Jakarta, Delhi	
Mưa lớn	Mumbai, Kolkata, Hà Nội, Đà Nẵng	
*/

// Định nghĩa kiểu dữ liệu cho weather
interface Weather {
  weather: { icon: string; description: string; main: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number; deg: number };
  name: string;
  cod: number;
  rain?: { '1h'?: number };
}

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<Weather | null>(null); // Sử dụng kiểu Weather hoặc null
  const [errorMessage, setErrorMessage] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);


  const icon = weather?.weather ? weather.weather[0].icon : '';
  const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

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

    return translations[description] || description;
  };

  //4.5: Nếu phát hiện điều kiện nguy hiểm, hiển thị cảnh báo trên giao diện 
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    } else {
      // Đối với iOS, sử dụng Alert thay vì Toast
      Alert.alert('Cảnh báo thời tiết', message);
    }
  };

  // Kiểm tra và hiển thị cảnh báo thời tiết
  const checkWeatherWarnings = (data: Weather) => {
  const result = checkDangerousWeather(data);
  setWarnings(result); // Cập nhật danh sách cảnh báo để hiển thị
  if (result.length > 0) {
    result.forEach(warning => {
      showToast(warning);
      });
    }
  };

  const goiAPIThoiTiet = () => {
    fetchWeatherData(city)
      .then(data => {
        setWeather(data);
        setCity('');
        setErrorMessage('');
        checkWeatherWarnings(data);
      })
      .catch(err => {
        setErrorMessage("Đã xảy ra lỗi! Vui lòng thử lại.");
      });
  };

  const resetDuLieu = () => {
    setCity('');
    setWeather(null); // Đặt lại weather về null
    setErrorMessage('');
  };

  // 4.1: Người dùng nhập tên thành phố và nhấn nút “XEM”.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ứng dụng Thời tiết!</Text>
      <Text style={styles.subtitle}>Mời bạn nhập tên thành phố:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(value) => setCity(value)}
        value={city}
        placeholder="Nhập tên thành phố"
      />
      <View style={styles.actions}>
        <Button title='Xem' onPress={goiAPIThoiTiet} color="#007BFF" />
        <Button title='Xóa' onPress={resetDuLieu} color="#FF5733" />
      </View>
      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}
      {weather?.cod === 200 && (
        <WeatherInfo 
          weather={weather} 
          iconURL={iconURL} 
          translateWeatherDescription={translateWeatherDescription}
          warnings={warnings}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0D8EA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderStyle: 'solid',
    borderColor: 'blue',
    borderWidth: 1,
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});