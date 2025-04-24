// Store the JSON data globally for easier access
let supplierData = [];

// Fetch and load JSON files
function loadSupplierData() {
  fetch('./Tables/xbslog_international.json')
    .then((response) => response.json())
    .then((data) => {
      supplierData = data.destinations;
      populateCountryDropdown();
    })
    .catch((error) => console.error('Error loading supplier data:', error));
}

// Function to populate the "Select Country" dropdown
function populateCountryDropdown() {
  const countryList = document.getElementById("country-list");
  countryList.innerHTML = ""; // Clear previous options

  const uniqueCountries = [...new Set(supplierData.map((item) => item.country))].sort();

  uniqueCountries.forEach((country) => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = country;
    a.onclick = () => {
      selectCountry(country);
      hideDropdown("country-list");
    };
    countryList.appendChild(a);
  });
}

// Function to handle country selection
function selectCountry(country) {
  const countryInput = document.getElementById("country");
  countryInput.value = country;

  const zoneInput = document.getElementById("zone");
  zoneInput.disabled = false;
  populateZoneDropdown(country);

  countryInput.dispatchEvent(new Event("input"));
}

// Populate the "Select Zone" dropdown based on the selected country
function populateZoneDropdown(country) {
  const zoneList = document.getElementById("zone-list");
  zoneList.innerHTML = "";

  const zones = supplierData
    .filter((item) => item.country === country)
    .map((item) => item.code);

  const uniqueZones = [...new Set(zones)].sort();

  uniqueZones.forEach((zone) => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = zone;
    a.onclick = () => {
      selectZone(zone);
      hideDropdown("zone-list");
    };
    zoneList.appendChild(a);
  });
}

// Function to handle zone selection
function selectZone(zone) {
  const zoneInput = document.getElementById("zone");
  zoneInput.value = zone;

  zoneInput.dispatchEvent(new Event("input"));
}

// Function to show the dropdown
function showDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.style.display = "block";
}

// Function to hide the dropdown
function hideDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.style.display = "none";
}

// Function to add a new line dynamically
function addLine() {
  const container = document.getElementById("dimension-container");

  const newLine = document.createElement("div");
  newLine.className = "form-group dimension-line";

  newLine.innerHTML = `
      <div>
          <input type="number" class="width" min="0" max="999" maxlength="3" oninput="validateInput(this)">
      </div>
      <div>
          <input type="number" class="length" min="0" max="999" maxlength="3" oninput="validateInput(this)">
      </div>
      <div>
          <input type="number" class="height" min="0" max="999" maxlength="3" oninput="validateInput(this)">
      </div>
      <div>
          <input type="number" class="quantity" min="0" max="999" maxlength="3" oninput="validateInput(this)">
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
  `;

  container.appendChild(newLine);
}

// Function to remove a specific line
function removeLine(button) {
  const line = button.parentElement.parentElement;
  line.remove();
}

// Function to validate input fields to restrict to 3 numeric digits
function validateInput(input) {
  input.value = input.value.replace(/\D/g, '');

  if (input.value.length > 3) {
    input.value = input.value.slice(0, 3);
  }
}

// Function to validate all lines and highlight missing fields
function finalCalculate() {
  const lines = document.querySelectorAll(".dimension-line");
  let allValid = true;

  lines.forEach((line) => {
    const width = line.querySelector(".width");
    const length = line.querySelector(".length");
    const height = line.querySelector(".height");
    const quantity = line.querySelector(".quantity");
    const type = line.querySelector(".type");

    if (!width.value) {
      highlightField(width);
      allValid = false;
    } else {
      removeHighlight(width);
    }

    if (!length.value) {
      highlightField(length);
      allValid = false;
    } else {
      removeHighlight(length);
    }

    if (!height.value) {
      highlightField(height);
      allValid = false;
    } else {
      removeHighlight(height);
    }

    if (!quantity.value) {
      highlightField(quantity);
      allValid = false;
    } else {
      removeHighlight(quantity);
    }

    if (!type.value) {
      highlightField(type);
      allValid = false;
    } else {
      removeHighlight(type);
    }
  });

  const errorMessage = document.getElementById("error-message");
  if (!allValid) {
    errorMessage.textContent = "Please fill in all the required fields.";
  } else {
    errorMessage.textContent = "";
    calculateResults();
  }
}

// Helper function to highlight a field with a red border
function highlightField(field) {
  field.classList.add("highlight");
}

// Helper function to remove red border from a field
function removeHighlight(field) {
  field.classList.remove("highlight");
}

// Function to calculate total cubic meters (m³)
function calculateResults() {
  const lines = document.querySelectorAll(".dimension-line");
  let totalCubicMeters = 0;

  lines.forEach((line) => {
    const width = parseFloat(line.querySelector(".width").value) || 0;
    const length = parseFloat(line.querySelector(".length").value) || 0;
    const height = parseFloat(line.querySelector(".height").value) || 0;
    const quantity = parseInt(line.querySelector(".quantity").value, 10) || 0;

    const cubicMeters = (width * length * height) / 1000000; // Convert cm³ to m³
    const totalForLine = cubicMeters * quantity;

    totalCubicMeters += totalForLine;

    const cubicCapacityField = line.querySelector(".cubic-capacity");
    cubicCapacityField.value = totalForLine.toFixed(3); // Display m³ for the line
  });

  const result = document.getElementById("result");
  result.textContent = `Total Cubic Meters: ${totalCubicMeters.toFixed(3)} m³`;
}

// Add event listeners for inputs
document.getElementById("country").addEventListener("focus", () => {
  showDropdown("country-list");
});

document.getElementById("country").addEventListener("blur", () => {
  setTimeout(() => hideDropdown("country-list"), 200);
});

document.getElementById("zone").addEventListener("focus", () => {
  showDropdown("zone-list");
});

document.getElementById("zone").addEventListener("blur", () => {
  setTimeout(() => hideDropdown("zone-list"), 200);
});

// Load supplier data on page load
window.onload = loadSupplierData;
