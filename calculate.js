// Function to create a map of countries and their respective zones
function createCountryZoneMap(destinations) {
  const map = {};
  destinations.forEach((destination) => {
    const { country, code } = destination;

    // If the country doesn't exist in the map, initialize it as an empty array
    if (!map[country]) {
      map[country] = [];
    }
    // Add the zone code to the respective country (avoiding duplicates)
    if (!map[country].includes(code)) {
      map[country].push(code);
    }
  });
  return map;
}

// Function to populate the "Select Country" dropdown
function populateCountryDropdown(countries) {
  const countryList = document.getElementById("country-list");
  countryList.innerHTML = ""; // Clear previous options

  // Sort and ensure uniqueness of countries
  const uniqueCountries = [...new Set(countries)].sort();

  uniqueCountries.forEach((country) => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = country;
    a.onclick = () => {
      selectCountry(country);
    };
    countryList.appendChild(a);
  });
}
