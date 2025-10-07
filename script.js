const unitBtn = document.querySelector(".dropdown-btn");
const dropdown = document.querySelector(".dropdown");

const dropdownWrapper = document.querySelector(".days-dropdown-wrapper");
const dropdownBtn = dropdownWrapper.querySelector(".days-dropdown-btn");
const dropdownMenu = dropdownWrapper.querySelector(".custom-days-dropdown");
const dropdownItems = dropdownWrapper.querySelectorAll(".dropdown-day-item");
const selectedDayText = dropdownWrapper.querySelector(".selected-day");
const dropdownArrow = dropdownWrapper.querySelector(".dropdown-arrow");
const hourlyMain = document.querySelector(".hourly-forecast-cards");

const inp = document.querySelector("input");
const form = document.querySelector("form");

let currentWeatherData = null;


unitBtn.addEventListener("click", () => {
    dropdown.classList.toggle("dropdowndisplay");
});


async function fetchWeather(location) {
    try {
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            console.log("Enter a valid location");
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0, 1];

        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,weather_code,precipitation_sum&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&timezone=auto`
        );

        const weatherData = await weatherRes.json();
        currentWeatherData = weatherData;

        console.log(`Weather for ${name}, ${country}`);
        console.log(weatherData);


        showCurrentWeather(weatherData.current, name, country);
        showWeatherStats(weatherData.current);
        dailyForecast(weatherData.daily);
        hourlyForecast(weatherData.hourly, 0);
    } catch (err) {
        document.querySelector(".failed-api").style.display = "flex"
        console.error("Data not coming", err);

    };
}


function getWeatherIcon(code) {
    if (code === 0) return "icon-sunny";
    if ([1, 2, 3].includes(code)) return "icon-overcast";
    if ([45, 48].includes(code)) return "icon-fog";
    if ([51, 53, 55].includes(code)) return "icon-drizzle";
    if ([61, 63, 65].includes(code)) return "icon-rain";
    if ([71, 73, 75].includes(code)) return "icon-snow";
    if ([95, 96, 99].includes(code)) return "icon-storm";
    return "icon-sunny"; 
}



function showCurrentWeather(current, city, country) {
    const iconFile = getWeatherIcon(current.weather_code);
    const formattedDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });


    document.querySelector(".city-info h1").textContent = `${city}, ${country}`;
    document.querySelector(".city-info h3").textContent = formattedDate;
    document.querySelector(".temperauremain h1").textContent = `${Math.round(current.temperature_2m)}°`;
    document.querySelector(".temperauremain img").src = `./weather-app-main/assets/icons/${iconFile}.webp`;
}


function showWeatherStats(current) {
    document.querySelector(".feel-like p:nth-child(2)").textContent = `${Math.round(current.apparent_temperature)}°`;
    document.querySelector(".Humidity p:nth-child(2)").textContent = `${current.relative_humidity_2m}%`;
    document.querySelector(".Wind p:nth-child(2)").textContent = `${current.wind_speed_10m} km/h`;
    document.querySelector(".Precipitationmain p:nth-child(2)").textContent = `${current.precipitation} mm`;
}


function dailyForecast(daily) {
    const forecast = document.querySelector(".daily-forcast");
    forecast.innerHTML = "";

    daily.time.forEach((date, index) => {
        const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
        const max = Math.round(daily.temperature_2m_max[index]);
        const min = Math.round(daily.temperature_2m_min[index]);
        const code = daily.weather_code[index];
        const iconFile = getWeatherIcon(code);

        forecast.innerHTML += `
      <div class="forecast-card">
        <p class="day">${dayName}</p>
      <img src="./weather-app-main/assets/icons/${iconFile}.webp" alt="Weather icon">
        <p class="temp">${max}° / ${min}°</p>
      </div>
    `;
    });
}


function hourlyForecast(hourly, selectedDay) {
    hourlyMain.innerHTML = "";

  
  const hoursPerDay = 24;
  const start = selectedDay * hoursPerDay;
  const end = start + hoursPerDay;

  const dayHours = hourly.time.slice(start, end);
  const temps = hourly.temperature_2m.slice(start, end);
  const codes = hourly.weather_code.slice(start, end);

  const limitedHours = dayHours.slice(0, 8);
  const limitedTemps = temps.slice(0, 8);
  const limitedCodes = codes.slice(0, 8);

    limitedHours.forEach((time, index) => {
        const hourLabel = new Date(time).getHours().toString().padStart(2, "0") + ":00";
        const iconFile = getWeatherIcon(codes[index]);
        const temp = Math.round(temps[index]);

        hourlyMain.innerHTML += `
      <div class="hourly-forecast-card">
    <img src="./weather-app-main/assets/icons/${iconFile}.webp" 
     alt="icon" 
     style="width: 25px; height: 25px;" />
        <span class="hour-label">${hourLabel}</span>
        <span class="hour-temp">${temp}°</span>
      </div>
    `;
    });
}


dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show");
    dropdownArrow.classList.toggle("open");
});

dropdownItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        dropdownMenu.classList.remove("show");
        dropdownArrow.classList.remove("open");
        selectedDayText.textContent = item.textContent;

        if (currentWeatherData) {
            hourlyForecast(currentWeatherData.hourly, index);
        }
    });
});


form.addEventListener("submit", (e) => {

    e.preventDefault();
    const location = inp.value.trim();

    if (!location) {
        console.log("enter a valid location");
        return
    };
    fetchWeather(location);
});




