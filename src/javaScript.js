let apiKey = "774391238c6a53bc1cf424560a1347de";
let globalTempCelsius = null; 
let globalmaxTempObject = [];
let globalminTempObject = []; 
let localOffsetToUTC = null;
let cityOffsettoUTC = null;

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
  "Sunday"
];
timeElement.innerHTML = `${dayName[day]} ${hours}:${minutes}`;



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
  document.querySelector("#icon").innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" width = 90px>`;
  
  // formatting time
  //calculate time difference from UTC at current position 
  let localTimestamp = new Date().getTime();
  localOffsetToUTC = new Date().getTimezoneOffset()*60000;
  cityOffsettoUTC = response.data.timezone *1000;
  let timestamp = localTimestamp + localOffsetToUTC + cityOffsettoUTC;

  changeTime (timestamp);
  
}

function displayForecast(response){
globalmaxTempObject = [];
globalminTempObject=[];
for (let count = 0; count < 6; count ++){
let hours = new Date (response.data.list[count].dt*1000).getHours();
//adjust hours to timezone
hours = hours +((localOffsetToUTC+cityOffsettoUTC)/3600000);

if (hours >= 24){
  hours = hours-24;
}
if (hours < 0){
  hours = 24 +hours;
}

if (hours < 10) {
  hours = `0${hours}`;
}

let minutes = new Date (response.data.list[count].dt*1000).getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
document.querySelector(`#time${count+1}`).innerHTML = `${hours}:${minutes} `;
document.querySelector(`#maxTemp${count+1}`).innerHTML = `${Math.round(response.data.list[count].main.temp_max)}°`;
document.querySelector(`#lowTemp${count+1}`).innerHTML = `/${Math.round(response.data.list[count].main.temp_min)}°`;
document.querySelector(`#fcImg${count+1}`).innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.list[count].weather[0].icon}@2x.png" width = 60px>`;
globalmaxTempObject.push (Math.round(response.data.list[count].main.temp_max));
globalminTempObject.push( Math.round(response.data.list[count].main.temp_min));
}

}

// Default weather Berlin
let defaultCity = "Berlin";
let defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}&units=metric`;
axios.get(defaultUrl).then(displayWeather);
// 3h slot forecast
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${defaultCity}&appid=${apiKey}&units=metric`;
  axios.get(forecastURL).then(displayForecast);



//City change

function changeCity(event) {
  event.preventDefault();

  // Set unit back to default Celsius if changed prior
  document.querySelector("#tempF").classList.remove("unit-used");
  document.querySelector("#tempC").classList.add("unit-used");

  let city = document.querySelector("#city-input").value;

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(displayWeather);

  // 3h slot forecast
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(forecastURL).then(displayForecast);
  
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
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(url).then(displayWeather);
}

let position = document.querySelector("button");
position.addEventListener("click", getLocation);


//Unit change
function convertCelciusToFarenheit(event){
    event.preventDefault();
    document.querySelector("#currentTemp").innerHTML = `${Math.round ((globalTempCelsius * 9/5) + 32)}°`;
    //forecast conversion
    for (let count = 0; count < 6; count ++){
      document.querySelector(`#maxTemp${count+1}`).innerHTML = `${Math.round ((globalmaxTempObject[count] * 9/5) + 32)}°`;
      document.querySelector(`#lowTemp${count+1}`).innerHTML = `/${Math.round ((globalminTempObject[count] * 9/5) + 32)}°`;
    }
    
    
    let unitF = document.querySelector("#tempF");
    unitF.classList.add("unit-used");

    let unitC = document.querySelector("#tempC");
    unitC.classList.remove("unit-used");
}

function convertFarenheitToCelcius(event){
    event.preventDefault();
    document.querySelector("#currentTemp").innerHTML = `${Math.round (globalTempCelsius)}°`;
    //forecast conversion
    for (let count = 0; count < 6; count ++){
      document.querySelector(`#maxTemp${count+1}`).innerHTML = `${Math.round (globalmaxTempObject[count])}°`;
      document.querySelector(`#lowTemp${count+1}`).innerHTML = `/${Math.round (globalminTempObject[count])}°`;
    }
    
    let unitF = document.querySelector("#tempF");
    unitF.classList.remove("unit-used");

    let unitC = document.querySelector("#tempC");
    unitC.classList.add("unit-used");
}

let tempC = document.querySelector("#tempC");
let tempF = document.querySelector("#tempF");

tempF.addEventListener("click", convertCelciusToFarenheit);
tempC.addEventListener("click", convertFarenheitToCelcius);

