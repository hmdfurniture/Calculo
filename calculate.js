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

      // Extract countries and zones
      const countryZoneMap = createCountryZoneMap(allDestinations);

      // Populate countries in the dropdown
      populateCountryDropdown(Object.keys(countryZoneMap));

      // Setup event listener for country selection
      setupCountrySelection(countryZoneMap);
    })
    .catch((error) => {
      console.error("Error loading data:", error);
      document.getElementById("error-message").innerText =
        "Failed to load country and zone data. Please try again later.";
    });
});

// Function to create a map of countries and their respective zones
function createCountryZoneMap(destinations) {
  const map = {};
  destinations.forEach((destination) => {
    const { country, code } = destination;

    // If the country doesn't exist in the map, initialize it as an empty array
    if (!map[country]) {
      map[country] = [];
    }
    // Add the zone code to the respective country
    map[country].push(code);
  });
  return map;
}

// Function to populate the "Select Country" dropdown
function populateCountryDropdown(countries) {
  const countryList = document.getElementById("country-list");
  countryList.innerHTML = ""; // Clear previous options

  // Sort countries alphabetically
  countries.sort();

  countries.forEach((country) => {
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
function setupCountrySelection(countryZoneMap) {
  const countryInput = document.getElementById("country");
  const zoneList = document.getElementById("zone-list");
  const zoneInput = document.getElementById("zone");

  // When the user types or selects a country, update the zones
  countryInput.addEventListener("input", () => {
    const selectedCountry = countryInput.value;
    const zones = countryZoneMap[selectedCountry] || [];
    populateZoneDropdown(zones);
  });

  // Function to populate the "Select Zone" dropdown
  function populateZoneDropdown(zones) {
    zoneList.innerHTML = ""; // Clear previous zones

    if (zones.length === 0) {
      // If no zones are available, disable the zone input
      zoneInput.disabled = true;
      zoneList.innerHTML = "<p>No zones available for this country.</p>";
    } else {
      zoneInput.disabled = false;
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

// Function to add a new dimension line
function addLine() {
  const dimensionContainer = document.getElementById("dimension-container");
  const lineTemplate = `
    <div class="form-group dimension-line">
      <div>
        <input type="number" class="width" min="0" max="999" oninput="validateInput(this)">
      </div>
      <div>
        <input type="number" class="length" min="0" max="999" oninput="validateInput(this)">
      </div>
      <div>
        <input type="number" class="height" min="0" max="999" oninput="validateInput(this)">
      </div>
      <div>
        <input type="number" class="quantity" min="0" max="999" oninput="validateInput(this)">
      </div>
      <div>
        <select class="type" oninput="removeHighlight(this)">
          <option value="box">Box</option>
          <option value="pallet">Pallet</option>
        </select>
      </div>
      <div>
        <input type="text" class="cubic-capacity" readonly>
      </div>
      <div>
        <button class="remove-button" onclick="removeLine(this)">Remove</button>
      </div>
    </div>`;
  dimensionContainer.insertAdjacentHTML("beforeend", lineTemplate);
}

// Function to remove a dimension line
function removeLine(button) {
  const line = button.closest(".dimension-line");
  line.remove();
}

// Function to validate input for numeric fields
function validateInput(input) {
  if (input.value > 999) {
    input.value = 999; // Enforce the maximum value
  }
}

// Function to calculate the final total volumetric weight
function finalCalculate() {
  const dimensionContainer = document.getElementById("dimension-container");
  const dimensionLines =
    dimensionContainer.getElementsByClassName("dimension-line");
  let totalVolumetricWeight = 0;
  let hasError = false;

  for (let i = 0; i < dimensionLines.length; i++) {
    const widthInput = dimensionLines[i].getElementsByClassName("width")[0];
    const lengthInput = dimensionLines[i].getElementsByClassName("length")[0];
    const heightInput = dimensionLines[i].getElementsByClassName("height")[0];
    const quantityInput =
      dimensionLines[i].getElementsByClassName("quantity")[0];
    const typeInput = dimensionLines[i].getElementsByClassName("type")[0];

    const width = parseFloat(widthInput.value);
    const length = parseFloat(lengthInput.value);
    const height = parseFloat(heightInput.value);
    const quantity = parseInt(quantityInput.value);
    const type = typeInput.value;

    if (
      isNaN(width) ||
      isNaN(length) ||
      isNaN(height) ||
      isNaN(quantity) ||
      width <= 0 ||
      length <= 0 ||
      height <= 0 ||
      quantity <= 0
    ) {
      // Highlight invalid fields
      if (width <= 0 || isNaN(width)) widthInput.classList.add("highlight");
      if (length <= 0 || isNaN(length)) lengthInput.classList.add("highlight");
      if (height <= 0 || isNaN(height)) heightInput.classList.add("highlight");
      if (quantity <= 0 || isNaN(quantity))
        quantityInput.classList.add("highlight");
      hasError = true;
    } else {
      // Remove highlights for valid fields
      widthInput.classList.remove("highlight");
      lengthInput.classList.remove("highlight");
      heightInput.classList.remove("highlight");
      quantityInput.classList.remove("highlight");

      const cubicCapacity = (width * length * height * quantity) / 1000000;
      let volumetricWeight = 0;

      if (type === "box" || (type === "pallet" && height <= 125)) {
        volumetricWeight = cubicCapacity * 300; // 1 m³ = 300 kg
      } else if (type === "pallet" && height > 125) {
        volumetricWeight = cubicCapacity * 1750; // 1 ldm = 1750 kg
      }

      // Round up to the nearest hundred
      volumetricWeight = Math.ceil(volumetricWeight / 100) * 100;

      dimensionLines[i].getElementsByClassName("cubic-capacity")[0].value =
        volumetricWeight.toFixed(2);
      totalVolumetricWeight += volumetricWeight;
    }
  }

  if (hasError) {
    document.getElementById("error-message").innerText =
      "* Please fill in the mandatory fields.";
  } else {
    document.getElementById("error-message").innerText = "";
    document.getElementById(
      "result"
    ).innerText = `Total Volumetric Weight: ${totalVolumetricWeight.toFixed(
      2
    )} kg`;
  }
}
