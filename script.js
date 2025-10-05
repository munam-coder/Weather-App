let unitbtn = document.querySelector(".dropdown-btn");
let dropdown = document.querySelector(".dropdown");
let daysdropdown = document.querySelector(".days-dropdown-btn");
let showdropdown = document.querySelector(".custom-days-dropdown");


unitbtn.addEventListener("click", () => {
    dropdown.classList.toggle("dropdowndisplay")
});


async function fetchwheather(location) {
    try{
       let geors = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`)
       let geodata = await geors.json();


       console.log(geodata);

       if(!geodata.results || geodata.results.lenght === 0 ){
            console.log("Enter a valid location")
            return
       }

       let { latitude, longitude, name, country } = geodata.results[0];

        let wheatherfor = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,weather_code,precipitation_sum&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&timezone=auto`)

       let wheahterres = await wheatherfor.json();

       console.log(`wheather for ${name}, ${country} `);
       console.log(wheahterres)




    }
    catch(err){
        console.error("data is not coming ",err)

    }
};


function getwheathericon(code){
    if(code === 0) return "icon-sunny";
    if([1, 2, 3].includes(code)) return "icon-overcast";
    if([45, 48].includes(code)) return "icon-fog";
    if([51, 53, 55].includes(code)) return "icon-drizzle";
    if([61, 63, 65].includes(code)) return "icon-rain";
    if([71, 73, 75].includes(code)) return "icon-snow";
    if([95, 96, 99].includes(code)) return "icon-storm";
    return "icon-sunny";
}


function showcurrentwheather(mainwheatherdata){
    
    let mainwheathertemp = document.querySelector(".show-wheather-container")
    mainwheatherdata.innerHtml = "";

    let iconfile = getwheathericon(code);

const city = "Berlin, Germany";
const temperature = 20;
const weatherIcon = `./icons/${iconfile}`;
const date = new Date();

// Format date nicely
const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
const formattedDate = date.toLocaleDateString('en-US', options);

// Update DOM dynamically using querySelector
document.querySelector(".city-info h1").textContent = city;
document.querySelector(".city-info h3").textContent = formattedDate;
document.querySelector(".temperauremain h1").textContent = `${temperature}°`;
document.querySelector(".temperauremain img").src = weatherIcon;


}

function showwheatherstats(data){
    let stats = document.querySelector(".weather-stats");
    stats.innerHTML = "";

    // Example dynamic data (replace these with API data)
const feelsLike = 21;
const humidity = 53;
const wind = 10;
const precipitation = 2;

// Target the second <p> inside each container
document.querySelector(".feel-like p:nth-child(2)").textContent = `${feelsLike}°`;
document.querySelector(".Humidity p:nth-child(2)").textContent = `${humidity}%`;
document.querySelector(".Wind p:nth-child(2)").textContent = `${wind} km/h`;
document.querySelector(".Precipitationmain p:nth-child(2)").textContent = `${precipitation} mm`;

}


function dailyforcast(dailydata){
    let forcast = document.querySelector(".daily-forcast");
    forcast.innerHTML = "";
    
    const {time, temperature_2m_max, temperature_2m_min, weather_code,} = dailydata;

    time.forEach((data, index) => {

         const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });

         let maxtemp = temperature_2m_max[index];
         let mintemp = temperature_2m_min[index];
         let code = wheather_code[index];

         let iconfile = getwheathericon(code);

         const day = dayName;
const icon = `./icons${iconfile}`;
const temp =  `${maxtemp}/${mintemp}`;

document.querySelector(".forecast-card .day").textContent = dayName;
document.querySelector(".forecast-card img").src = `./icons${iconfile}`;
document.querySelector(".forecast-card .temp").textContent = temp;

    })
    

}

daysdropdown.addEventListener("click", () => {
    showdropdown.classList.toggle("show");
});

function hourlyforcast(hourlydata){
    
}

