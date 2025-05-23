import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import useWeatherLogic from '../applogic/useWeatherLogic';
import WeatherInfo from '../components/WeatherInfo';

export default function HomeScreen({ navigation }: any) {
  const {
    city,
    weather,
    errorMessage,
    iconURL,
    validateCity,
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
        onChangeText={validateCity}
        value={city}
        placeholder="Nhập tên thành phố"
      />

      <View style={styles.actions}>
      //1.1.4.	Homescreen gọi hàm fecthWeather của useWeatherLogic 
        <Button title="Xem" onPress={fetchWeather} color="#007BFF" />
        <Button title="Xóa" onPress={resetData} color="#FF5733" />
        <Button title="Cài đặt" onPress={() => navigation.navigate('Cài đặt')} />
        <Button title="Dự báo" onPress={() => navigation.navigate('Dự báo', { city })} color="#28A745"/>
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      //1.1.10.	HomeScreen nhận dữ liệu từ state và gọi render component WeatherInfo
      {weather?.cod === 200 && (
        //1.1.11.	HomeScreen truyền props gồm weather, iconURL, warnings và 
        // hàm translateWeatherDescription vào WeatherInfo.
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
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    color: '#1A237E',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#3F51B5',
    textAlign: 'center',
  },
  input: {
    borderColor: '#3F51B5',
    borderWidth: 1.5,
    padding: 14,
    marginVertical: 16,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  error: {
    color: '#D32F2F',
    fontWeight: '600',
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});