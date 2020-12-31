// Date and Time
let time = document.querySelector("#time");
let now = new Date();
let day = now.getDay();
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let dayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
time.innerHTML = `${dayName[day]} ${hours}:${minutes}`;



// Get weather from API
function displayWeather(response) {
  console.log(response);
  let cityPosition = document.querySelector("#city");
  cityPosition.innerHTML = response.data.name;
  let currentTemp = document.querySelector("#currentTemp");
  let country = document.querySelector("#country");
  let discription = document.querySelector("#discription");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  currentTemp.innerHTML = `${Math.round(response.data.main.temp)}°`;
  country.innerHTML = `, ${response.data.sys.country}`;
  discription.innerHTML = response.data.weather[0].main;
  humidity.innerHTML = `${response.data.main.humidity}%`;
  wind.innerHTML = `${Math.round(response.data.wind.speed * 3.6)} km/h`;

  //icon 
  console.log (response.data.weather[0].icon);
  document.querySelector("#icon").innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" width = 90px>`;
}

// Default weather Berlin
let apiKey = "774391238c6a53bc1cf424560a1347de";
let defaultCity = "Berlin";
let defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}&units=metric`;
axios.get(defaultUrl).then(displayWeather);

//City change

function changeCity(event) {
  event.preventDefault();
  let apiKey = "774391238c6a53bc1cf424560a1347de";
  let city = document.querySelector("#city-input").value;
  console.log(city);

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(displayWeather);
}



let city = document.querySelector("#city-form");
city.addEventListener("submit", changeCity);

//Current Position
function getLocation() {
  navigator.geolocation.getCurrentPosition(myPosition);
}

function myPosition(position) {
  let apiKey = "774391238c6a53bc1cf424560a1347de";
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  console.log(`Latitude = ${lat}; Longitude = ${long}`);
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(url).then(displayWeather);
}

let position = document.querySelector("button");
position.addEventListener("click", getLocation);


//Unit change
function convertCelciusToFarenheit(event){
    event.preventDefault();
    let max = document.querySelector("#currentTemp");
    let min = document.querySelector("#tempMin");
    max.innerHTML = "84°";
    min.innerHTML = "/77";

    let unitF = document.querySelector("#tempF");
    unitF.classList.add("unit-used");

    let unitC = document.querySelector("#tempC");
    unitC.classList.remove("unit-used");
}

function convertFarenheitToCelcius(event){
    event.preventDefault();
    let max = document.querySelector("#currentTemp");
    let min = document.querySelector("#tempMin");
    max.innerHTML = "29°";
    min.innerHTML = "/25";

    let unitF = document.querySelector("#tempF");
    unitF.classList.remove("unit-used");

    let unitC = document.querySelector("#tempC");
    unitC.classList.add("unit-used");
}

let tempC = document.querySelector("#tempC");
let tempF = document.querySelector("#tempF");

tempF.addEventListener("click", convertCelciusToFarenheit);
tempC.addEventListener("click", convertFarenheitToCelcius);

// Forcast box
// enter days
document.querySelector("#forecastDay1").innerHTML =`${dayName[day+1]}`;
document.querySelector("#forecastDay2").innerHTML =`${dayName[day+2]}`;
document.querySelector("#forecastDay3").innerHTML =`${dayName[day+3]}`;
document.querySelector("#forecastDay4").innerHTML =`${dayName[day+4]}`;
document.querySelector("#forecastDay5").innerHTML =`${dayName[day+5]}`;
document.querySelector("#forecastDay6").innerHTML =`${dayName[day+6]}`;