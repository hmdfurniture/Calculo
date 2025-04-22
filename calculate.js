document.addEventListener("DOMContentLoaded", () => {
  // Fetch the list of files in the Tables folder
  fetch("https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch file list: ${response.statusText}`);
      }
      return response.json();
    })
    .then((files) => {
      // Filter only JSON files
      const jsonFiles = files.filter((file) => file.name.endsWith(".json"));

      // Fetch and process all JSON files
      return Promise.all(
        jsonFiles.map((file) =>
          fetch(file.download_url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch JSON file: ${file.name}`);
              }
              return response.json();
            })
            .catch((error) => {
              console.error(`Error fetching ${file.name}:`, error);
              return null; // Skip this file if there's an error
            })
        )
      );
    })
    .then((dataArray) => {
      // Merge all destinations from the fetched data
      const allDestinations = dataArray
        .filter((data) => data !== null) // Remove null entries
        .flatMap((data) => data.destinations || []); // Merge destinations

      // Process countries and zones
      const { countryZoneMap, zoneSupplierMap } = createCountryZoneMap(
        allDestinations
      );

      // Populate countries in the dropdown
      populateCountryDropdown(Object.keys(countryZoneMap));

      // Setup event listener for country selection
      setupCountrySelection(countryZoneMap, zoneSupplierMap);
    })
    .catch((error) => {
      console.error("Error loading data:", error);
      document.getElementById("error-message").innerText =
        "Failed to load country and zone data. Please try again later.";
    });
});

// Function to create a map of countries and their respective zones
function createCountryZoneMap(destinations) {
  const countryZoneMap = {}; // Map of countries -> zones
  const zoneSupplierMap = {}; // Map of zones -> suppliers

  destinations.forEach((destination) => {
    const { country, code } = destination;

    // Populate country -> zones map
    if (!countryZoneMap[country]) {
      countryZoneMap[country] = [];
    }
    if (!countryZoneMap[country].includes(code)) {
      countryZoneMap[country].push(code);
    }

    // Populate zone -> suppliers map
    if (!zoneSupplierMap[code]) {
      zoneSupplierMap[code] = [];
    }
    zoneSupplierMap[code].push(destination); // Keep the full destination object
  });

  return { countryZoneMap, zoneSupplierMap };
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

// Function to set up event listeners for country selection
function setupCountrySelection(countryZoneMap, zoneSupplierMap) {
  const countryInput = document.getElementById("country");
  const zoneList = document.getElementById("zone-list");
  const zoneInput = document.getElementById("zone");

  // When the user types or selects a country, update the zones
  countryInput.addEventListener("input", () => {
    const selectedCountry = countryInput.value;
    const zones = countryZoneMap[selectedCountry] || [];
    populateZoneDropdown(zones, zoneSupplierMap);
  });

  // Function to populate the "Select Zone" dropdown
  function populateZoneDropdown(zones, zoneSupplierMap) {
    zoneList.innerHTML = ""; // Clear previous zones

    if (zones.length === 0) {
      // If no zones are available, disable the zone input
      zoneInput.disabled = true;
      zoneList.innerHTML = "<p>No zones available for this country.</p>";
    } else {
      zoneInput.disabled = false;

      // Populate all unique zones
      zones.forEach((zone) => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = zone;
        a.onclick = () => {
          zoneInput.value = zone;
        };
        zoneList.appendChild(a);
      });
    }
  }
}

// Function to handle country selection
function selectCountry(country) {
  const countryInput = document.getElementById("country");
  countryInput.value = country;

  // Trigger input event to populate zones
  countryInput.dispatchEvent(new Event("input"));
}
