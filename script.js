const search = document.getElementById('search');
const submit = document.getElementById('submit');

const primaryInfo = document.getElementById('primary-info');
const locationInfo = document.getElementById('location-info');
const locationWeather = document.getElementById('location-weather');

const locationName = document.getElementById('location-name');
const locationRegion = document.getElementById('location-region');
const currentTemp = document.getElementById('current-temp');
const currentCondition = document.getElementById('current-condition');
const currentConditionIcon = document.getElementById('current-condition-icon');
const currentFeelsLike = document.getElementById('current-feels-like');
const tableInfo = document.getElementById('info-table');

let currentLocation = {};

function getLocationInfo(city) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.weatherapi.com/v1/current.json?key=4f349a250bb64e618a8211606231602&q=${city}&aqi=no`)
        .then((response) => {return response.json()})
        .then((data) => {setCurrentLocation(data)})
        .catch((error) => {
            console.log(error);
            locationName.textContent = "Location not found. Please try again";
        });
    });
}

function setCurrentLocation(data) {
    currentLocation = data;
    search.value = "";
    populateDOM();
}



function populateDOM() {
    // Adjust text content
    locationName.textContent = currentLocation.location.name;
    locationRegion.textContent = currentLocation.location.region;
    currentLocation.current.degree = "f";
    currentTemp.textContent = currentLocation.current.temp_f + "°";
    currentTemp.classList = "fahrenheit";

    currentCondition.textContent = currentLocation.current.condition.text;
    currentConditionIcon.src = currentLocation.current.condition.icon;
    currentFeelsLike.textContent = "Feels like: " + currentLocation.current.feelslike_f + "° F";
    setConditionIcon();
    fillTable();

}

function toggleDegrees() {
    let degree = currentLocation.current.degree;
    if (degree == "f") {
        currentLocation.current.degree = "c";
        currentTemp.classList = "celsius";
        currentTemp.textContent = currentLocation.current.temp_c + "°";
        currentFeelsLike.textContent = "Feels like: " + currentLocation.current.feelslike_c + "° C";
    }
    else {
        currentLocation.current.degree = "f";
        currentTemp.classList = "fahrenheit";
        currentTemp.textContent = currentLocation.current.temp_f + "°";
        currentFeelsLike.textContent = "Feels like: " + currentLocation.current.feelslike_f + "° F";
    }
}

submit.addEventListener('click', async (e) => {
    e.preventDefault();
    if (search.value !== "") {
        loadingInfo();
        let location = await getLocationInfo(search.value);
        setCurrentLocation(location);
        // Update Dom
        populateDOM();
    }
})

currentTemp.addEventListener('mousedown', (e) => {
    e.preventDefault();
    toggleDegrees();
}, false);


function setConditionIcon() {
    const condition = currentLocation.current.condition.text.toLowerCase();

    if (condition.includes("sunny") || condition.includes('clear')) {
        currentConditionIcon.classList = "fa-solid fa-sun";
    } else if (condition.includes("cloudy") || condition.includes('overcast') || condition.includes('fog')) {
        currentConditionIcon.classList = "fa-solid fa-cloud";
    } else if (condition.includes("rain") || condition.includes('drizzle') || condition.includes("rain shower") || condition.includes('mist')) {
        currentConditionIcon.classList = "fa-solid fa-cloud-rain";
    } else if (condition.includes("thunder")) {
        currentConditionIcon.classList = "fa-solid fa-cloud-bolt";
    } else if (condition.includes('snow') || condition.includes('blizzard') || condition.includes('sleet') || condition.includes('snow shower')) {
        currentConditionIcon.classList = "fa-solid fa-snowflake";
    } else if (condition.includes('shower')) {
        currentConditionIcon.classList = "fa-solid fa-cloud-showers-heavy";
    } else {
        currentConditionIcon.classList = "fa-solid fa-sun";
    }
}

function loadingInfo() {
    locationName.textContent = "Loading location information...";
    locationRegion.textContent = "";
    currentTemp.textContent = "";
    currentTemp.classList = "";

    currentCondition.textContent = ""
    currentConditionIcon.classList = "";
    currentFeelsLike.textContent = "";
}

function fillTable() {
    tableInfo.innerHTML = "";
    for (property in currentLocation.current) {
        if (property != "condition") {
            const newRow = document.createElement('tr');
            const label = document.createElement('td');
            const data = document.createElement('td');
    
                label.textContent = property;
                data.textContent = currentLocation.current[property];
        
            newRow.append(label, data);
            tableInfo.append(newRow);
        }
    }
}