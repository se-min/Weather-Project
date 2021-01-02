let apiKey = "774391238c6a53bc1cf424560a1347de";
let globalTempCelsius = null; 

// Date and Time
function changeTime(timestamp){
let timeElement = document.querySelector("#time");
let now = new Date(timestamp);

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
timeElement.innerHTML = `${dayName[day]} ${hours}:${minutes}`;

// Forcast box
// enter days
document.querySelector("#forecastDay1").innerHTML =`${dayName[day+1]}`;
document.querySelector("#forecastDay2").innerHTML =`${dayName[day+2]}`;
document.querySelector("#forecastDay3").innerHTML =`${dayName[day+3]}`;
document.querySelector("#forecastDay4").innerHTML =`${dayName[day+4]}`;
document.querySelector("#forecastDay5").innerHTML =`${dayName[day+5]}`;
document.querySelector("#forecastDay6").innerHTML =`${dayName[day+6]}`;
}


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
  discription.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = `${response.data.main.humidity}%`;
  wind.innerHTML = `${Math.round(response.data.wind.speed * 3.6)} km/h`;

  //updateing global temperature variable for conversion
  globalTempCelsius = response.data.main.temp;

  //icon 
  console.log (response.data.weather[0].icon);
  document.querySelector("#icon").innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" width = 90px>`;
  
  // formatting time
  //calculate time difference from UTC at current position 
  let localTimestamp = new Date().getTime();
  let localOffsetToUTC = new Date().getTimezoneOffset()*60000;
  let cityOffsettoUTC = response.data.timezone *1000;
  let timestamp = localTimestamp + localOffsetToUTC + cityOffsettoUTC;

  changeTime (timestamp);
}

// Default weather Berlin
let defaultCity = "Berlin";
let defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}&units=metric`;
axios.get(defaultUrl).then(displayWeather);



//City change

function changeCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;

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
    document.querySelector("#currentTemp").innerHTML = `${Math.round ((globalTempCelsius * 9/5) + 32)}°`;
    
    let unitF = document.querySelector("#tempF");
    unitF.classList.add("unit-used");

    let unitC = document.querySelector("#tempC");
    unitC.classList.remove("unit-used");
}

function convertFarenheitToCelcius(event){
    event.preventDefault();
    document.querySelector("#currentTemp").innerHTML = `${Math.round (globalTempCelsius)}°`;
    
    let unitF = document.querySelector("#tempF");
    unitF.classList.remove("unit-used");

    let unitC = document.querySelector("#tempC");
    unitC.classList.add("unit-used");
}

let tempC = document.querySelector("#tempC");
let tempF = document.querySelector("#tempF");

tempF.addEventListener("click", convertCelciusToFarenheit);
tempC.addEventListener("click", convertFarenheitToCelcius);

