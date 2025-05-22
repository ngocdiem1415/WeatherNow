export interface WeatherData {
cod: number;
  name: string;
  weather: { icon: string; description: string; main: string }[];
  main: { //Nhiệt độ, cảm nhận, độ ẩm
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: { //	Tốc độ và hướng gió
    speed: number;
    deg: number;
  };
  rain?: { //Lượng mưa trong 1h 
    '1h'?: number;
  };
}
