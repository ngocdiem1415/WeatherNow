import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveSettings, loadSettings } from '../utils/Storage';
import { scheduleDailyNotification } from '../services/NotificationService';

export default function SettingsScreen() {
  const [city, setCity] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadSettings().then((settings) => {
      setCity(settings.city);
      const newTime = new Date();
      newTime.setHours(settings.hour);
      newTime.setMinutes(settings.minute);
      setTime(newTime);
    });
  }, []);

  const handleSave = async () => {
    try {
      const hour = time.getHours();
      const minute = time.getMinutes();

      if (!city || city.trim() === '') {
        alert('Vui lòng nhập tên thành phố');
        return;
      }

      await saveSettings(city, hour, minute);
      await scheduleDailyNotification(city, hour, minute);

      alert(`Đã lưu cài đặt! Thông báo sẽ hiển thị hàng ngày lúc ${hour}:${minute < 10 ? '0' : ''}${minute}`);
    } catch (error) {
      console.error('Error in handleSave:', error);
      alert(`Có lỗi khi đặt lịch thông báo: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt thông báo</Text>
      <Text style={styles.subtitle}>Thành phố:</Text>
      <TextInput
        value={city}
        onChangeText={setCity}
        style={styles.input}
        placeholder="VD: Hanoi"
      />
      <Text style={styles.subtitle}>
        Giờ thông báo: {time.getHours()}:{time.getMinutes() < 10 ? '0' : ''}{time.getMinutes()}
      </Text>
      <Button title="Chọn giờ" onPress={() => setShowPicker(true)} color="#3F51B5" />
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          onChange={(e, selectedTime) => {
            if (selectedTime) setTime(selectedTime);
            setShowPicker(false);
          }}
        />
      )}
      <View style={{ marginTop: 24, width: '100%' }}>
        <Button title="Lưu cài đặt" onPress={handleSave} color="#3F51B5" />
      </View>
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
    color: '#3F51B5',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#3F51B5',
    textAlign: 'center',
    width: '100%',
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
});
