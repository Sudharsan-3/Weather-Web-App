import { useState, useEffect } from 'react';
import './App.css';

import searchIcon from './assets/search.png';
import clearIcon from './assets/clear.png';

import windIcon from './assets/wind.png';
import snowIcon from './assets/snow.png';
import humidityIcon from './assets/humidity.png';

const WeatherDetails = ({ icon, temp, city, country, lat, lng, humidity, wind, description }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className='description'>{description}</div>
      <div className='temp'>{temp}°C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude</span> <span>{lat}</span>
        </div>
        <div>
          <span className='lng'>Longitude</span> <span>{lng}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt="Humidity" className='icon' />
          <div className='data'>
            <div className='humidity-percent'>{humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="Wind" className='icon' />
          <div className='data'>
            <div className='wind-percent'>{wind} km/h</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  let api_key = "e2a06dfe0de0d3e0b3a66aeaede42084";

  const [text, setText] = useState("Chennai");
  const [icon, setIcon] = useState(snowIcon);
  const [description, setDescription] = useState("");
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const search = async () => {
    setLoading(true);
    setError(null);
    setCityNotFound(false);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === '404') {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLng(data.coord.lon);
      setDescription(data.weather[0].description);
      
      const weatherIconCode = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      setIcon(weatherIconCode || clearIcon);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const addToFavorites = () => {
    if (!favorites.includes(city) && city) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorites = (favCity) => {
    const updatedFavorites = favorites.filter((fav) => fav !== favCity);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const loadFavoriteCity = (favCity) => {
    setText(favCity);
    search();
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input
            onChange={handleCityChange}
            type="text"
            className='cityInput'
            placeholder='Search City'
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div onClick={() => search()} className='search-icon'>
            <img src={searchIcon} alt="Search" />
          </div>
        </div>

        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City not found</div>}

        {!loading && !cityNotFound && (
          <>
            <WeatherDetails
              icon={icon}
              description={description}
              temp={temp}
              city={city}
              country={country}
              lat={lat}
              lng={lng}
              humidity={humidity}
              wind={wind}
            />
            <div    onClick={addToFavorites} className="fav-button">
              
             <h3>Add to Favorites ⭐</h3> 
            </div>
          </>
        )}

        {favorites.length > 0 && (
          <div className='favorites-container'>
            <h2>Favorites</h2>
            <ul>
              {favorites.map((favCity, index) => (
                <li key={index}>
                  <span onClick={() => loadFavoriteCity(favCity)}>{favCity}</span>
                  <button className='rm-btn' onClick={() => removeFromFavorites(favCity)}>X</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className='copyright'>
          Designed by <span>Sudharsan S</span>
        </p>
      </div>
    </>
  );
}

export default App;
