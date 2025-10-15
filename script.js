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
const searchBtn = document.querySelector(".searchbtn button");

let currentWeatherData = null;

const celsiusBtn = document.querySelector(".Celsiusbtn");
const fahrenheitBtn = document.querySelector(".Fahrenheitbtn");
const kmhBtn = document.querySelector(".kmh-btn");
const mphBtn = document.querySelector(".mph");
const mmBtn = document.querySelector(".Millimetersbtn");
const inchesBtn = document.querySelector(".Inchesbtn");

let currentUnits = {
  temperature: "metric",
  wind: "kmh",
  precipitation: "mm"
};

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

    const { latitude, longitude, name, country } = geoData.results[0];

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
    document.querySelector(".main-wheather-continer").style.display = "none";
    document.querySelector(".failed-api").style.display = "flex";
    console.error("Data not coming", err);
  }
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

function convertTemperature(tempC) {
  return currentUnits.temperature === "imperial" ? (tempC * 9) / 5 + 32 : tempC;
}

function convertWindSpeed(speedKmh) {
  return currentUnits.wind === "mph" ? speedKmh / 1.609 : speedKmh;
}

function convertPrecipitation(mm) {
  return currentUnits.precipitation === "in" ? mm / 25.4 : mm;
}

function updateDisplay() {
  if (!currentWeatherData) return;
  const { current, daily, hourly } = currentWeatherData;
  const [city, country] = document.querySelector(".city-info h1").textContent.split(",");
  showCurrentWeather(current, city, country);
  showWeatherStats(current);
  dailyForecast(daily);
  hourlyForecast(hourly, 0);
}

function showCurrentWeather(current, city, country) {
  const iconFile = getWeatherIcon(current.weather_code);
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const temp = Math.round(convertTemperature(current.temperature_2m));
  const symbol = currentUnits.temperature === "imperial" ? "°F" : "°C";

  document.querySelector(".city-info h1").textContent = `${city}, ${country}`;
  document.querySelector(".city-info h3").textContent = formattedDate;
  document.querySelector(".temperauremain h1").textContent = `${temp}${symbol}`;
  document.querySelector(".temperauremain img").src = `/assets/icons/${iconFile}.webp`;
}

function showWeatherStats(current) {
  const feel = Math.round(convertTemperature(current.apparent_temperature));
  const tempSymbol = currentUnits.temperature === "imperial" ? "°F" : "°C";
  const wind = convertWindSpeed(current.wind_speed_10m).toFixed(1);
  const windSymbol = currentUnits.wind === "mph" ? "mph" : "km/h";
  const precipitation = convertPrecipitation(current.precipitation).toFixed(1);
  const precipitationSymbol = currentUnits.precipitation === "in" ? "in" : "mm";

  document.querySelector(".feel-like p:nth-child(2)").textContent = `${feel}${tempSymbol}`;
  document.querySelector(".Humidity p:nth-child(2)").textContent = `${current.relative_humidity_2m}%`;
  document.querySelector(".Wind p:nth-child(2)").textContent = `${wind} ${windSymbol}`;
  document.querySelector(".Precipitationmain p:nth-child(2)").textContent = `${precipitation} ${precipitationSymbol}`;
}

function dailyForecast(daily) {
  const forecast = document.querySelector(".daily-forcast");
  forecast.innerHTML = "";

  daily.time.forEach((date, index) => {
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
    const max = Math.round(convertTemperature(daily.temperature_2m_max[index]));
    const min = Math.round(convertTemperature(daily.temperature_2m_min[index]));
    const symbol = currentUnits.temperature === "imperial" ? "°F" : "°C";
    const code = daily.weather_code[index];
    const iconFile = getWeatherIcon(code);

    forecast.innerHTML += `
      <div class="forecast-card">
        <p class="day">${dayName}</p>
        <img src="/assets/icons/${iconFile}.webp" alt="Weather icon">
        <p class="temp">${max}${symbol} / ${min}${symbol}</p>
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
    const iconFile = getWeatherIcon(limitedCodes[index]);
    const temp = Math.round(convertTemperature(limitedTemps[index]));
    const symbol = currentUnits.temperature === "imperial" ? "°F" : "°C";

    hourlyMain.innerHTML += `
      <div class="hourly-forecast-card">
        <img src="/assets/icons/${iconFile}.webp" 
             alt="icon" 
             style="width: 25px; height: 25px;" />
        <span class="hour-label">${hourLabel}</span>
        <span class="hour-temp">${temp}${symbol}</span>
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
    if (currentWeatherData) hourlyForecast(currentWeatherData.hourly, index);
  });
});

form.addEventListener("submit", handleSearch);
searchBtn.addEventListener("click", handleSearch);

function handleSearch(e) {
  e.preventDefault();
  const location = inp.value.trim();
  if (!location) return console.log("Enter a valid location");
  fetchWeather(location);
}

function closeDropdown() {
  dropdown.classList.remove("dropdowndisplay");
}

celsiusBtn.addEventListener("click", () => {
  currentUnits.temperature = "metric";
  updateDisplay();
  closeDropdown();
});

fahrenheitBtn.addEventListener("click", () => {
  currentUnits.temperature = "imperial";
  updateDisplay();
  closeDropdown();
});

kmhBtn.addEventListener("click", () => {
  currentUnits.wind = "kmh";
  updateDisplay();
  closeDropdown();
});

mphBtn.addEventListener("click", () => {
  currentUnits.wind = "mph";
  updateDisplay();
  closeDropdown();
});

mmBtn.addEventListener("click", () => {
  currentUnits.precipitation = "mm";
  updateDisplay();
  closeDropdown();
});

inchesBtn.addEventListener("click", () => {
  currentUnits.precipitation = "in";
  updateDisplay();
  closeDropdown();
});
