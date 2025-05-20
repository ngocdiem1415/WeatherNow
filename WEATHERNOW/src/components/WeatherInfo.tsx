import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface WeatherInfoProps {
  weather: any;
  iconURL: string;
  translateWeatherDescription: (description: string) => string;
}

//1.1.11 khởi tạo hàm chuyển đổi
const WeatherInfo: React.FC<WeatherInfoProps> = ({ weather, iconURL, translateWeatherDescription }) => {
  return (
    <View style={styles.weatherInfo}>
      <Text style={styles.cityName}>{`Tên thành phố: ${weather.name}`}</Text>
      <Image source={{ uri: iconURL }} style={styles.icon} />
      <Text style={styles.temp}>{`Nhiệt độ hiện tại: ${weather.main.temp} °C`}</Text>
      <Text style={styles.infoText}>{`Nhiệt độ cảm thấy: ${weather.main.feels_like} °C`}</Text>
      <Text style={styles.infoText}>{`Độ ẩm: ${weather.main.humidity}%`}</Text>
      <Text style={styles.infoText}>{`Tốc độ gió: ${weather.wind.speed} km/h`}</Text>
      <Text style={styles.infoText}>{`Hướng gió: ${weather.wind.deg} độ`}</Text>
      <Text style={styles.infoText}>{`Mô tả thời tiết: ${translateWeatherDescription(weather.weather[0].description)}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherInfo: {
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cityName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temp: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  icon: {
    width: 120,
    height: 120,
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default WeatherInfo;