import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface WeatherInfoProps {
  weather: {
    weather: { icon: string; description: string; main: string }[];
    main: { temp: number; feels_like: number; humidity: number };
    wind: { speed: number; deg: number };
    name: string;
    cod: number;
    rain?: { '1h'?: number };
  };
  iconURL: string;
  translateWeatherDescription: (description: string) => string;
  warnings: string[];
}

//4.3: API trả về dữ liệu thời tiết, bao gồm nhiệt độ, tốc độ gió, lượng mưa, và mô tả thời tiết.
const WeatherInfo: React.FC<WeatherInfoProps> = ({
  weather, iconURL, translateWeatherDescription, warnings
}) => {
  return (
    <View style={styles.weatherInfo}>
      <Text style={styles.cityName}>Tên thành phố: {weather.name}</Text>
      <Image source={{ uri: iconURL }} style={styles.icon} />
      <Text style={styles.temp}>Nhiệt độ hiện tại: {weather.main.temp} °C</Text>
      <Text>Nhiệt độ cảm thấy: {weather.main.feels_like} °C</Text>
      <Text>Độ ẩm: {weather.main.humidity}%</Text>
      <Text>Tốc độ gió: {weather.wind.speed} km/h</Text>
      <Text>Hướng gió: {weather.wind.deg} độ</Text>
      <Text>Mô tả thời tiết: {translateWeatherDescription(weather.weather[0].description)}</Text>

      {/* Hiển thị cảnh báo */}
      {warnings.length > 0 && (
        <View style={styles.warningBox}>
          {warnings.map((warn, index) => (
            <Text key={index} style={styles.warningText}>⚠️ {warn}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  weatherInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 18,
    marginBottom: 5,
  },
  icon: {
    width: 100,
    height: 100,
  },
    warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    width: '100%',
  },
  warningText: {
    color: '#856404',
    fontWeight: 'bold',
  },
});

export default WeatherInfo;