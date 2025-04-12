// App.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import WeatherInfo from './WeatherInfo';
import { fetchWeatherData } from '../services/WeatherAPI';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const icon = weather.weather ? weather.weather[0].icon : '';
  const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const translateWeatherDescription = (description: string) => {
    const translations = {
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

  const goiAPIThoiTiet = () => {
    fetchWeatherData(city)
      .then(data => {
        setWeather(data);
        setCity('');
        setErrorMessage('');
      })
      .catch(err => {
        setErrorMessage("Đã xảy ra lỗi! Vui lòng thử lại.");
      });
  };

  const resetDuLieu = () => {
    setCity('');
    setWeather({});
    setErrorMessage('');
  };

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
      {weather.cod === 200 && (
        <WeatherInfo weather={weather} iconURL={iconURL} translateWeatherDescription={translateWeatherDescription} />
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
