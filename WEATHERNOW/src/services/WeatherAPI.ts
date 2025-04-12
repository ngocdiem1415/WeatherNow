const apiKey = 'a1a36cf6b5b66be39e5d00e7b9f1c162';

export const fetchWeatherData = (city: string) => {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  return fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data)
    .catch((err) => {
      console.log("Error:", err);
      throw err;
    });
};
