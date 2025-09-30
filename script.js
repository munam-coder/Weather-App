let unitbtn = document.querySelector(".dropdown-btn");
let dropdown = document.querySelector(".dropdown");

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
}


