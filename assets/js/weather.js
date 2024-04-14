let InputSearchBox = document.querySelector("input[type='text']");
let iconSearchBox = document.querySelector(".icon-search-box");
let btnGeolocation = document.querySelector(".button");

let cityLocation = document.querySelector(".loc-city");
let Time = document.querySelector(".loc-time");

let detailsWeather = document.querySelector(".details-weather .row");
let todayHighlights = document.querySelector(
  ".details-today .row .Today-Highlights"
);
let todayForecast = document.querySelector(
  ".details-today .row .Days-Foecast ul"
);

let ApiKey = "6e312eb7e06c4490815130014240604";
let Url =
  "http://api.weatherapi.com/v1/forecast.json?key=6e312eb7e06c4490815130014240604&q=qena&days=7";

// Get City By Geolocation
btnGeolocation.addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation, checkError);
  }
});
//  Get Position Location
async function showLocation(location) {
  // console.log(location);
  let latitudePosition = location.coords.latitude;
  let longitudePosition = location.coords.longitude;

  let response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitudePosition}&lon=${longitudePosition}&format=json`
  );
  let data = await response.json();
  // console.log(data);
  // console.log(data.address.city);
  // console.log(data.address.country);
  let city = data.address.city;
  getDataCity(city);
}
//  Get Type Erorr
function checkError(error) {
  console.log(error);
  switch (error.code) {
    case error.PERMISSION_DENIED:
      cityLocation.textContent = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      cityLocation.textContent = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      cityLocation.textContent = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      cityLocation.textContent = "An unknown error occurred.";
      break;
  }
}

// Get Data City And  Default City
async function getDataCity(city = "cairo") {
  let response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${city}&days=7`
  );
  let data = await response.json();
  // console.log(data);
  displayWeather(data);
}

// Setting Default City
getDataCity();

// Get City Weather By Input Search Box
async function getCityWeather() {
  let citySearchBox = InputSearchBox.value;
  if (citySearchBox !== "") {
    let response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${citySearchBox}&days=7`
    );
    let data = await response.json();
    // console.log(data);
    displayWeather(data);
  }
}

// Get City Weather By Input Search
InputSearchBox.addEventListener("blur", getCityWeather);
document.addEventListener("keydown", function (e) {
  if (InputSearchBox.value !== "" && e.code === "Enter") {
    getCityWeather();
  }
});

// Get City Weather By Icon Search
iconSearchBox.addEventListener("click", function () {
  if (InputSearchBox.value !== "") {
    getCityWeather();
  }
});

// Display Weather Data
function displayWeather(data) {
  // console.log(data);
  let myDate = new Date(data.location.localtime);
  let currentTime = myDate.toLocaleString("en-us", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });

  // Current Weather
  cityLocation.textContent = `${data.location.name}, ${data.location.country}`;
  Time.textContent = currentTime;
  // Container For Details Weather
  let containerDetailsWeather = ` <div class="left-content">
                  <div class="current-weather row align-items-center">
                    <div class="col-3 image">
                      <img
                        src="${data.current.condition.icon}"
                        class="w-100 d-block"
                        alt="icon weather"
                      />
                    </div>
                    <div class="col-9 content-current-weather">
                      <div>
                        <span class="fs-4 fw-medium">${data.current.temp_f} <sup>F</sup></span>
                        <p class="fs-5 fw-medium">${data.current.condition.text}</p>
                        <!-- <p class="pt-2 fs-6 m-0">
                          Expect sunny skies. The high will be 90°.
                        </p> -->
                      </div>
                    </div>
                  </div>
                </div>
              <!--   SunSet & SunRise--> 
                <div
                  class="right-content d-flex justify-content-center align-items-center"
                >
                  <ul class="list-unstyled mb-0">
                    <li><span class="fw-medium"><img src="./assets/imgs/sunrise.svg" width="30" alt="sunrise"> Sunrise :</span> ${data.forecast.forecastday[0].astro.sunrise}</li>
                    <li><span class="fw-medium"><img src="./assets/imgs/sunset.svg" width="30" alt="sunrset"> Sunset :</span> ${data.forecast.forecastday[0].astro.sunset}</li>
                  </ul>
                </div> `;
  // Container For Highlights Details Weather
  let containerHighlightsToday = `
                <h4 class="m-0">Today Highlights</h4>
                <ul
                  class="list-unstyled border rounded mt-3 mx-2 d-flex flex-wrap"
                >
                  <li class="p-3 w-50 border-bottom border-end">
                    <h6 class="text-capitalize fst-italic">Feels Like</h6>
                    <img
                      src="./assets/imgs/temperature-max.svg"
                      width="30"
                      alt="Feels like"
                    />
                    <span>${data.current.feelslike_f} °C</span>
                  </li>
                  <li class="p-3 w-50 border-bottom">
                    <h6 class="text-capitalize fst-italic">pressure</h6>
                    <img
                      src="./assets/imgs/pressure.svg"
                      width="30"
                      alt="pressure"
                    />
                    <span>${data.current.pressure_in} mbar</span>
                  </li>
                  <li class="p-3 w-50 border-end">
                    <h6 class="text-capitalize fst-italic">Wind</h6>
                    <img src="./assets/imgs/wind.svg" width="30" alt="Wind" />
                    <span>${data.current.wind_kph} km/h</span>
                  </li>
                  <li class="p-3 w-50">
                    <h6 class="text-capitalize fst-italic">humidity</h6>
                    <img
                      src="./assets/imgs/humidity.svg"
                      width="40"
                      alt="Wind"
                    />
                    <span>${data.current.humidity} %</span>
                  </li>
                </ul>
              `;

  let ForeCastDays = data.forecast.forecastday;
  // console.log(ForeCastDays[0].day.avgtemp_c);
  todayForecast.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    // Container For Days Forecast Details Weather
    let ContainerForecast = `
        <li
          class="rounded border my-2 p-1 px-3 d-flex align-items-center justify-content-between"
        >
          <div class="day-forecast">${ForeCastDays[i].date}</div>
          <span class="percentage-forecast">${ForeCastDays[i].day.avgtemp_c}%</span>
          <div class="image-forecast">
            <img
              src="${ForeCastDays[i].day.condition.icon}"
              class="d-block"
              width="50"
              alt=""
            />
          </div>
        </li>
  `;
    todayForecast.innerHTML += ContainerForecast;
  }

  detailsWeather.innerHTML = containerDetailsWeather;
  todayHighlights.innerHTML = containerHighlightsToday;
}
