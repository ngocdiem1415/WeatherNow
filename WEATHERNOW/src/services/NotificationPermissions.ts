import * as Notifications from 'expo-notifications';
// Kiểm tra và xin quyền gửi thông báo từ người dùng
export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}
