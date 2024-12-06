import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getFavoriteLocations,
  saveFavoriteLocation,
  removeFavoriteLocation
} from "../configs/firebase";
import styles from "./weather.module.css"

export const Weather = () => {
  let [error, setError] = useState(null);
  let [weatherData, setWeatherData] = useState({});
  let [city, setCity] = useState("");
  let [favoritess, setFavorites] = useState([]);

  useEffect(() => {
    getFavoriteLocations().then((result) =>{
        setFavorites((f) => result);
    });
  }, [favoritess]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if(city.trim() != "")
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
          import.meta.env.VITE_OPEN_WEATHER_APP_ID
        }`
      );
      setWeatherData(response.data);
      setError(null);

    } catch (err) {
      setError("Unable to fetch weather data");
    }
  };

  function handleSetCity(e){
    setCity(c => e.target.value)
  }

  return (
    <>
      <div className={styles["app-container"]}>
        <h1 className={styles["title"]}>Weather App</h1>
        <form onSubmit={handleSubmit} className={styles["search-form"]}>
          <input
            type="text"
            value={city}
            onChange={(e) => handleSetCity(e)}
            placeholder="Enter city name"
            className={styles["search-input"]}
          />
          <button type="submit" className={styles["search-button"]}>
            Get Weather
          </button>
        </form>
        {error && <p className={styles["error"]}>{error}</p>}
        {weatherData && (
          <div className={styles["weather-data"]}>
            <h2 className={styles["location"]}>{weatherData?.name}</h2>
            <p className={styles["temperature"]}>
              Temperature: {weatherData?.main?.temp}°C
            </p>
            <p className={styles["condition"]}>
              Condition:{" "}
              {weatherData ? weatherData?.weather?.[0]?.description : ""}
            </p>
            <button
              onClick={() => saveFavoriteLocation(city)}
              className={styles["save-button"]}
            >
              Save as Favorite
            </button>
          </div>
        )}
        <h3 className={styles["favorites-title"]}>Favorites:</h3>
        <ul className={styles["favorite-list"]}>
          {favoritess
            .sort((a, b) => a.city.localeCompare(b.city))
            .map((f, i) => (
              <li
                key={i}
                className={styles["favorite-item"]}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{f.city}</span> <span><button onClick={() => removeFavoriteLocation(f.id)} style={{backgroundColor: 'red', color: 'white', border: 'none', padding: '0.7rem'}}>Delete</button></span>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};
