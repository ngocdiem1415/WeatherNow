import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import useWeatherLogic from '../applogic/useWeatherLogic';
import WeatherInfo from '../components/WeatherInfo';

export default function HomeScreen() {
  const {
    city,
    weather,
    errorMessage,
    iconURL,
    validateCity, // Đổi từ handleCityChange thành validateCity
    fetchWeather,
    resetData,
    translateWeatherDescription,
    warnings,
  } = useWeatherLogic();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ứng dụng Dự báo thời tiết!</Text>
      <Text style={styles.subtitle}>Mời bạn nhập tên thành phố:</Text>

      <TextInput
        style={styles.input}
//1.1.2 Kiểm tra dữ liệu đã nhận
        onChangeText={validateCity}
        value={city}
        placeholder="Nhập tên thành phố"
      />

      <View style={styles.actions}>

        <Button title="Xem" onPress={fetchWeather} color="#007BFF" />
        <Button title="Xóa" onPress={resetData} color="#FF5733" />
      </View>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {weather?.cod === 200 &&
        <WeatherInfo
          weather={weather}
          iconURL={iconURL}
          translateWeatherDescription={translateWeatherDescription}
          warnings={warnings}
        />
      }
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
    borderColor: '#007BFF',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
})
