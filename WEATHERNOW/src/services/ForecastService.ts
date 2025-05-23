const apiKey = 'a1a36cf6b5b66be39e5d00e7b9f1c162';

export const fetchForecastData = (city: string) => {
  const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  return fetch(apiURL)
    .then((res) => {
      if (!res.ok) throw new Error(`Lỗi API: ${res.status}`);
      return res.json();
    })
    .catch((err) => {
      console.log('Error in forecast:', err);
      throw err;
    });
};
