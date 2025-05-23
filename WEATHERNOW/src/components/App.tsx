import React, { useEffect } from 'react';
import { Alert, Platform, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { fetchWeatherData } from '../services/WeatherService';
import { loadSettings } from '../utils/Storage';
import HomeScreen from '../screen/HomeScreen';
import SettingsScreen from '../screen/SettingsScreen';
import { translateWeatherDescription } from '../services/NotificationService';

const Stack = createNativeStackNavigator();

// Cấu hình mặc định cho thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    let appStateSubscription: any;

    const checkAndNotify = async () => {
      const settings = await loadSettings();
      const now = new Date();

      if (now.getHours() === settings.hour && now.getMinutes() === settings.minute) {
        const data = await fetchWeatherData(settings.city);
        const description = data.weather[0].description;
        const temp = data.main.temp;
        const translated = translateWeatherDescription(description);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `⏰ Bây giờ là ${settings.hour}:${settings.minute}`,
            body: `Thời tiết tại ${settings.city}: ${translated}, ${temp}°C`,
            sound: 'default',
          },
          trigger: null,
        });
      }
    };

    const startBackgroundCheck = () => {
      checkInterval = setInterval(checkAndNotify, 60000); // mỗi phút
    };

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        checkAndNotify(); // Kiểm tra khi app mở lại
      }
    };

    appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    startBackgroundCheck();
    checkAndNotify(); // Kiểm tra ngay khi mount

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (appStateSubscription) appStateSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-weather', {
          name: 'Thông báo thời tiết',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Bạn chưa cấp quyền nhận thông báo!',
          'Vui lòng cấp quyền để nhận thông báo thời tiết.'
        );
      }
    };

    setupNotifications();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Trang chính">
        <Stack.Screen name="Trang chính" component={HomeScreen} />
        <Stack.Screen name="Cài đặt" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
