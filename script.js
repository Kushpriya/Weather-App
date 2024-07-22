const apikey = "e370bac624e73f96916ec2daafb40e8e";

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude: lon, latitude: lat } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.cod === 200) {
            weatherReport(data);
          } else {
            alert("Failed to retrieve weather data for your location.");
          }
        })
        .catch(() =>
          alert("Failed to retrieve weather data for your location.")
        );
    });
  }

  document.getElementById("input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchByCity();
    }
  });
});

function searchByCity() {
  const place = document.getElementById("input").value;
  const urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;

  fetch(urlsearch)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === 200) {
        weatherReport(data);
      } else {
        alert("City not found. Please enter a valid city name.");
      }
    })
    .catch(() => alert("Failed to retrieve weather data. Please try again."));
  document.getElementById("input").value = "";
}

function weatherReport(data) {
  const urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

  fetch(urlcast)
    .then((res) => res.json())
    .then((forecast) => {
      if (forecast.cod === "200") {
        updateCurrentWeather(data);
        updateHourlyForecast(forecast);
        updateDailyForecast(forecast);
      } else {
        alert("Failed to retrieve forecast data.");
      }
    })
    .catch(() => alert("Failed to retrieve forecast data."));
}

function updateCurrentWeather(data) {
  document.getElementById(
    "city"
  ).innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById("temperature").innerText = `${Math.floor(
    data.main.temp - 273.15
  )} °C`;
  document.getElementById("clouds").innerText = data.weather[0].description;

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("img").src = iconUrl;
}

function updateHourlyForecast(forecast) {
  const templist = document.querySelector(".templist");
  templist.innerHTML = "";

  forecast.list.slice(0, 5).forEach((item) => {
    const date = new Date(item.dt * 1000);
    const hourR = document.createElement("div");
    hourR.className = "next";

    const time = document.createElement("p");
    time.className = "time";
    time.innerText = date.toLocaleTimeString(undefined, {
      timeZone: "Asia/Kathmandu",
      hour: "2-digit",
      minute: "2-digit",
    });

    const temp = document.createElement("p");
    temp.innerText = `${Math.floor(
      item.main.temp_max - 273.15
    )} °C / ${Math.floor(item.main.temp_min - 273.15)} °C`;

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.innerText = item.weather[0].description;

    hourR.appendChild(time);
    hourR.appendChild(temp);
    hourR.appendChild(desc);
    templist.appendChild(hourR);
  });
}

function updateDailyForecast(forecast) {
  const weekF = document.querySelector(".weekF");
  weekF.innerHTML = "";

  for (let i = 8; i < forecast.list.length; i += 8) {
    const item = forecast.list[i];
    const div = document.createElement("div");
    div.className = "dayF";

    const day = document.createElement("p");
    day.className = "date";
    day.innerText = new Date(item.dt * 1000).toDateString();

    const temp = document.createElement("p");
    temp.innerText = `${Math.floor(
      item.main.temp_max - 273.15
    )} °C / ${Math.floor(item.main.temp_min - 273.15)} °C`;

    const description = document.createElement("p");
    description.className = "desc";
    description.innerText = item.weather[0].description;

    div.appendChild(day);
    div.appendChild(temp);
    div.appendChild(description);
    weekF.appendChild(div);
  }
}
