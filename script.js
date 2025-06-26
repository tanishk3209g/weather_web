const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '56ace9b652mshf45515b4d213e63p16dde5jsn3c18d3f6c7b8',
		'x-rapidapi-host': 'weather-api138.p.rapidapi.com'
	}
};

function formatUnixTime(unixTime) {
	const date = new Date(unixTime * 1000);
	return date.toLocaleTimeString('en-IN', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
}


async function getWeather(city) {
	const url = `https://weather-api138.p.rapidapi.com/weather?city_name=${encodeURIComponent(city)}`;
	try {
		const response = await fetch(url, options);
		const result = await response.json();

		console.log(result);

		const iconCode = result.weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;


		const tempC = (result.main.temp - 273.15).toFixed(1);
		const tempMin = (result.main.temp_min - 273.15).toFixed(1);
		const tempMax = (result.main.temp_max - 273.15).toFixed(1);
		const feelsLike = (result.main.feels_like - 273.15).toFixed(1);
		const humidity = result.main.humidity;
		const pressure = result.main.pressure;
		const weatherMain = result.weather[0].main;
		const windSpeed = result.wind.speed;
		const windDeg = result.wind.deg;
		const rainAmount = result.rain?.["1h"] ?? 0;
		const visibility = result.visibility;
		const visibilityKm = (visibility / 1000).toFixed(1);
		const sunrise = formatUnixTime(result.sys.sunrise);
		const sunset = formatUnixTime(result.sys.sunset);


		// Temperature category
		let tempCategory = "";
		if (tempC < 10) tempCategory = "Cold";
		else if (tempC < 21) tempCategory = "Cool";
		else if (tempC <= 30) tempCategory = "Warm";
		else tempCategory = "Hot";

		// Visibility category
		let visibilityLabel = "";
		if (visibility >= 10000) visibilityLabel = "Excellent";
		else if (visibility >= 4000) visibilityLabel = "Good";
		else if (visibility >= 1000) visibilityLabel = "Moderate";
		else if (visibility >= 200) visibilityLabel = "Poor";
		else visibilityLabel = "Very Poor";

		// Update DOM
		// Update only the text inside <span id="city-name">
		document.getElementById("city-name").textContent = result.name;

		// Update the icon
		document.getElementById("weather-icon").src = iconUrl;
		document.getElementById("weather-icon").alt = result.weather[0].description;

		document.getElementById("temp_heading").innerHTML = `${tempC}°C<br><small>(${tempCategory})</small>`;
		document.getElementById("humidity_heading").innerHTML = `${humidity}%<br><small>(${weatherMain})</small>`;
		document.getElementById("temp_min").textContent = `${tempMin}°C`;
		document.getElementById("temp_max").textContent = `${tempMax}°C`;
		document.getElementById("feels_like").textContent = `${feelsLike}°C`;
		document.getElementById("wind-speed").textContent = `${windSpeed} m/s`;
		document.getElementById("wind-degree").textContent = `${windDeg}°`;
		document.getElementById("rain").textContent = `Rain Level (last 1h): ${rainAmount} mm`;
		document.getElementById("visibility").innerHTML = `${visibilityKm} km <br><small>(${visibilityLabel})</small>`;
		document.getElementById("sunrise").textContent = sunrise;
		document.getElementById("sunset").textContent = sunset;
		document.getElementById("pressure").textContent = `${pressure} hPa`;


		// Optionally update city name in heading
		//document.querySelector(".display-4").textContent = `${result.name} Weather`;

	} catch (error) {
		console.error('Error fetching weather:', error);
		alert("City not found or API error.");
	}
}

// Handle search form
function searchCity(event) {
	event.preventDefault(); // prevent page reload
	const city = document.getElementById("cityInput").value.trim();
	if (city) {
		getWeather(city);
	}
}

// Load default city on page load
getWeather("Delhi");
