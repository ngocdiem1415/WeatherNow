const apiKey = 'a1a36cf6b5b66be39e5d00e7b9f1c162';

export const fetchWeatherData = (city: string) => {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  //1.1.6.	WeatherService gọi hàm fetch của API
return fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      //1.1.7.	API trả về kết quả dự báo thời tiết tại vị trí đã nhận
      return response.json();
    })
    //1.1.8.	WeatherService trả về kết quả dự báo thời tiết cho useWeatherLogic dưới dạng data
    .then(data => data)
    .catch((err) => {
      console.log("Error:", err);
      throw err;
    });
};