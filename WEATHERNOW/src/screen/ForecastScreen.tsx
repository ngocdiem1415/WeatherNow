import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchForecastData } from '../services/ForecastService';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';


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
          <Text style={styles.dateText}>{item.dt_txt}</Text>
          <View style={styles.row}>
            <MaterialCommunityIcons name="thermometer" size={20} color="#0277bd" style={styles.icon} />
            <Text style={styles.cardText}>Nhiệt độ: {item.main.temp}°C</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="water-percent" size={20} color="#0277bd" style={styles.icon} />
            <Text style={styles.cardText}>Độ ẩm: {item.main.humidity}%</Text>
          </View>

          <View style={styles.row}>
            <FontAwesome5 name="wind" size={18} color="#0277bd" style={styles.icon} />
            <Text style={styles.cardText}>Tốc độ gió: {item.wind.speed} km/h</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="compass" size={20} color="#0277bd" style={styles.icon} />
            <Text style={styles.cardText}>Hướng gió: {item.wind.deg}°</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={20} color="#0277bd" style={styles.icon} />
            <Text style={styles.cardText}>Mô tả thời tiết: {translateWeatherDescription(item.weather[0].description)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#e0f7fa',
    minHeight: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    color: '#01579b',
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 20,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#4fc3f7',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0277bd',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15.5,
    color: '#37474f',
    marginBottom: 6,
    lineHeight: 22,
  },
  row: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},
  icon: {
    marginRight: 8,
  },
});
