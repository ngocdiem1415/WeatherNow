import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchForecastData } from '../services/ForecastService';

const translateWeatherDescription = (desc: string) => {
  const map: Record<string, string> = {
    "clear sky": "Trời quang đãng",
    "few clouds": "Ít mây",
    "scattered clouds": "Mây rải rác",
    "broken clouds": "Mây che phủ",
    "overcast clouds": "Mây u ám",
    "shower rain": "Mưa rào",
    "light rain": "Mưa nhẹ",
    "moderate rain": "Mưa vừa",
    "heavy intensity rain": "Mưa to",
    "rain": "Mưa",
    "thunderstorm": "Giông bão",
    "snow": "Tuyết",
    "mist": "Sương mù",
  };

  return map[desc.toLowerCase()] || desc;
};

export default function ForecastScreen({ route }: any) {
  const { city } = route.params;
  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    fetchForecastData(city).then((data) => {
      setForecast(data.list);
    });
  }, [city]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dự báo 5 ngày tới tại {city}</Text>
      {forecast.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text>{item.dt_txt}</Text>
          <Text>Nhiệt độ: {item.main.temp}°C</Text>
          <Text>Độ ẩm: {item.main.humidity}%</Text>
          <Text>Tốc độ gió: {item.wind.speed} km/h</Text>
          <Text>Hướng gió: {item.wind.deg}°</Text>
          <Text>Mô tả thời tiết: {translateWeatherDescription(item.weather[0].description)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
});
