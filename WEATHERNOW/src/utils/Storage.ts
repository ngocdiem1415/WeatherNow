import AsyncStorage from '@react-native-async-storage/async-storage';
// Lưu thông tin thành phố và giờ thông báo vào AsyncStorage
export const saveSettings = async (city: string, hour: number, minute: number) => {
  try {
    await AsyncStorage.multiSet([
      ['@weather_city', city],
      ['@notify_hour', hour.toString()],
      ['@notify_minute', minute.toString()],
    ]);
  } catch (err) {
    console.error('Lỗi lưu cài đặt:', err);
  }
};
//  Đọc dữ liệu đã lưu để sử dụng khi gửi thông báo
export const loadSettings = async () => {
  try {
    const [city, hourStr, minuteStr] = await AsyncStorage.multiGet([
      '@weather_city', '@notify_hour', '@notify_minute',
    ]).then(results => results.map(item => item[1]));

    return {
      city: city || '',
      hour: hourStr ? parseInt(hourStr) : 7,
      minute: minuteStr ? parseInt(minuteStr) : 0,
    };
  } catch (err) {
    console.error('Lỗi đọc cài đặt:', err);
    return { city: '', hour: 7, minute: 0 };
  }
};
