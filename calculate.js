// Store the JSON data globally for easier access
let supplierData = [];
let conversionFactors = {}; // Store conversion factors dynamically

// Fetch and load JSON files
function loadSupplierData() {
    fetch('./Tables/xbslog_international.json')
        .then((response) => response.json())
        .then((data) => {
            supplierData = data.destinations;
            conversionFactors = data.conversion; // Load conversion factors dynamically
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
    zoneList.innerHTML = ""; // Clear previous options

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

// Function to calculate total cubic meters (m³) or loading meters (LDM) and final cost
function calculateResults() {
    const lines = document.querySelectorAll(".dimension-line");
    let totalCubicMeters = 0;
    let totalLdm = 0;
    let hasBox = false;
    let hasPallet = false;
    let invalidPallet = false; // To track if any pallet has invalid dimensions
    const errorMessage = document.getElementById("result");

    lines.forEach((line) => {
        const width = parseFloat(line.querySelector(".width").value) || 0;
        const length = parseFloat(line.querySelector(".length").value) || 0;
        const height = parseFloat(line.querySelector(".height").value) || 0;
        const quantity = parseInt(line.querySelector(".quantity").value, 10) || 0;
        const type = line.querySelector(".type").value;

        if (type === "box") {
            hasBox = true;
            const cubicMeters = (width * length * height) / 1000000; // Convert cm³ to m³
            const totalForLine = cubicMeters * quantity;
            totalCubicMeters += totalForLine;

            const cubicCapacityField = line.querySelector(".cubic-capacity");
            cubicCapacityField.value = totalForLine.toFixed(3); // Display m³ for the line
        } else if (type === "pallet") {
            hasPallet = true;

            // Check for invalid pallet length
            if (length > 125 || length < 100) {
                invalidPallet = true;
                return; // Skip further processing for invalid pallets
            }

            // Valid pallet - Calculate LDM
            const ldm = (width / 200) * quantity; // LDM calculation (width in cm divided by 200 cm)
            totalLdm += ldm;

            const cubicCapacityField = line.querySelector(".cubic-capacity");
            cubicCapacityField.value = ldm.toFixed(2); // Display LDM for the line
        }
    });

    if (invalidPallet) {
        errorMessage.innerHTML =
            "The pallet does not have the standard measurements, so it is not possible to calculate the value automatically.";
        return;
    }

    const result = document.getElementById("result");
    const country = document.getElementById("country").value;
    const zone = document.getElementById("zone").value;

    if (!country || !zone || (totalCubicMeters === 0 && totalLdm === 0)) {
        result.textContent = "Please select a country, zone, and fill in dimensions.";
        return;
    }

    let totalWeight, roundedWeight, scaledWeight, rates, rateTier, cost;

    if (totalLdm > 0 && !hasBox) {
        // LDM-specific calculations
        totalWeight = totalLdm * conversionFactors.LDM; // Use LDM conversion factor
        roundedWeight = Math.ceil(totalWeight / 100) * 100;
        scaledWeight = roundedWeight / 100;

        rates = supplierData.find((item) => item.country === country && item.code === zone)?.rates;

        if (rates) {
            rateTier = getRateTier(totalWeight, rates);
            cost = scaledWeight * rates[rateTier];

            result.innerHTML = `
                <p>Total Ldm: ${totalLdm.toFixed(2)} m</p>
                <p>Total Weight: ${totalWeight.toFixed(2)} kg</p>
                <p>Rounded Weight: ${roundedWeight} kg</p>
                <p>Scaled Weight: ${scaledWeight} (in hundreds)</p>
                <p>Final Cost: €${cost.toFixed(2)}</p>
            `;
        } else {
            result.textContent = "No rates found for the selected country and zone.";
        }
    } else {
        // m³-specific calculations (for boxes or mixed)
        totalWeight = totalCubicMeters * conversionFactors.m3; // Use m³ conversion factor
        roundedWeight = Math.ceil(totalWeight / 100) * 100;
        scaledWeight = roundedWeight / 100;

        rates = supplierData.find((item) => item.country === country && item.code === zone)?.rates;

        if (rates) {
            rateTier = getRateTier(totalWeight, rates);
            cost = scaledWeight * rates[rateTier];

            result.innerHTML = `
                <p>Total Cubic Meters: ${totalCubicMeters.toFixed(3)} m³</p>
                <p>Total Weight: ${totalWeight.toFixed(2)} kg</p>
                <p>Rounded Weight: ${roundedWeight} kg</p>
                <p>Scaled Weight: ${scaledWeight} (in hundreds)</p>
                <p>Final Cost: €${cost.toFixed(2)}</p>
            `;
        } else {
            result.textContent = "No rates found for the selected country and zone.";
        }
    }
}
// Determine rate tier based on weight
function getRateTier(weight, rates) {
    if (weight < 500) return "<500kgs";
    if (weight < 1000) return "<1000kgs";
    if (weight < 2000) return "<2000kgs";
    if (weight < 3000) return "<3000kgs";
    if (weight < 4000) return "<4000kgs";
    if (weight < 5000) return "<5000kgs";
    return ">5000kgs";
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
