import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions } from './NotificationPermissions';
import { fetchWeatherData } from './WeatherService';
import { loadSettings } from '../utils/Storage';
 //  Yêu cầu quyền, hủy thông báo cũ và đặt thông báo mới
  // - Thông báo hàng ngày vào giờ đã chọn
  // - Thông báo thử nghiệm ngay lập tức
import { Platform } from 'react-native';

export const configureNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-weather', {
      name: 'Thông báo thời tiết hàng ngày',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
};

export const scheduleDailyNotification = async (city: string, hour: number, minute: number) => {
    await configureNotificationChannel(); // <== Thêm dòng này

  const granted = await requestNotificationPermissions();
  if (!granted) {
    alert('Chưa cấp quyền nhận thông báo. Vui lòng cấp quyền để nhận thông báo thời tiết.');
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  try {
    const data = await fetchWeatherData(city);
    const description = data.weather[0].description;
    const temp = data.main.temp;
    const translated = translateWeatherDescription(description);

    // Thông báo hàng ngày theo giờ đã đặt
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ Thời tiết lúc ${hour}:${minute}`,
        body: `Thời tiết tại ${city}: ${translated}, nhiệt độ ${temp}°C`,
        sound: 'default',
      },
      trigger: {
        hour,
        minute,
        repeats: true,
        channelId: 'daily-weather',
      },
    });

    // Thông báo test ngay lập tức
    await Notifications.scheduleNotificationAsync({
      content: {
        title: ` Thông báo thời tiết`,
        body: `Đã đặt lịch thông báo hàng ngày lúc ${hour}:${minute}`,
        sound: 'default',
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Lỗi khi lập lịch thông báo:', error);
    alert('Không thể lập lịch thông báo. Vui lòng thử lại.');
  }
};

// Giữ nguyên hàm translateWeatherDescription
export function translateWeatherDescription(desc: string): string {
  const map: { [key: string]: string } = {
    "clear sky": "trời quang đãng",
    "few clouds": "ít mây",
    "scattered clouds": "mây rải rác",
    "broken clouds": "mây che phủ",
    "shower rain": "mưa rào",
    "rain": "mưa",
    "thunderstorm": "bão có sấm",
    "snow": "tuyết",
    "mist": "sương mù",
    "overcast clouds": "mây u ám",
  };
  return map[desc] || desc;
}