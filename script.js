let unitbtn = document.querySelector(".dropdown-btn");
let dropdown = document.querySelector(".dropdown");

unitbtn.addEventListener("click", () => {
    dropdown.classList.toggle("dropdowndisplay")
});


async function fetchwheather(location) {
    try{
       let geors = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`)
       let geodata = await geors.json();

       if(!geodata.results || geodata.results.lenght === 0 ){
            console.log("Enter a valid location")
            return
       }

       let { latitude, longitude, name, country }  = geodata.results[0];

       

        




    }
    catch(err){







        // staritng tonight

    }
}


