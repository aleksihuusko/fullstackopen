import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then((response) => {
      setCountries(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getWeather(selectedCountry.capital[0]);
    }
  }, [selectedCountry]);

  const getWeather = (capital) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}`)
      .then((response) => {
        setWeather({
          ...response.data,
          iconUrl: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        });
      })
      .catch((error) => {
        console.error('Error fetching the weather data', error);
      });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    if (event.target.value === '') {
      setSelectedCountry(null);
      setWeather(null);
    }
  };

  const handleShowCountry = (countryName) => {
    const country = countries.find((country) => country.name.common === countryName);
    setSelectedCountry(country);
    setWeather(null);
  };

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <p>
        find countries
        <input type="text" value={filter} onChange={handleFilterChange} />
      </p>
      {countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : selectedCountry ? (
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <p>capital {selectedCountry.capital[0]}</p>
          <p>area {selectedCountry.area}</p>
          <h3>languages:</h3>
          <ul>
            {Object.values(selectedCountry.languages).map((language, i) => (
              <li key={i}>{language}</li>
            ))}
          </ul>
          <img src={selectedCountry.flags.png} alt={`flag of ${selectedCountry.name.common}`} />
          {weather && (
            <div>
              <h2>Weather in {selectedCountry.capital[0]}</h2>
              <p>temperature: {parseFloat((weather.main.temp - 273.15).toFixed(2))}°C</p>
              <img src={weather.iconUrl} alt={weather.weather[0].description} />
              <p>wind: {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      ) : (
        <ul>
          {countriesToShow.map((country, i) => (
            <li key={i}>
              {country.name.common}
              <button onClick={() => handleShowCountry(country.name.common)}>show</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
