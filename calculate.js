// Store the JSON data globally for easier access
let supplierData = [];

// Fetch and load JSON files
function loadSupplierData() {
    Promise.all([
        fetch('./Tables/xbslog_international.json').then((response) => response.json()),
        fetch('./Tables/xbslog_nacional.json').then((response) => response.json())
    ])
        .then(([internationalData, nacionalData]) => {
            // Associate conversion factors with each destination
            supplierData = [
                ...internationalData.destinations.map(item => ({
                    ...item,
                    conversion: internationalData.conversion
                })),
                ...nacionalData.destinations.map(item => ({
                    ...item,
                    conversion: nacionalData.conversion
                }))
            ];

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

// Function to add a new line dynamically
function addLine() {
    const container = document.getElementById("dimension-container");

    const newLine = document.createElement("div");
    newLine.className = "form-group dimension-line";

    newLine.innerHTML = `
        <div>
            <select class="type" oninput="removeHighlight(this)">
                <option value="box">Box</option>
                <option value="pallet">Pallet</option>
            </select>
        </div>
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

function calculateResults() {
    const lines = document.querySelectorAll(".dimension-line");
    let totalCubicMeters = 0;
    let totalLdm = 0;
    const country = document.getElementById("country").value;
    const zone = document.getElementById("zone").value;
    const result = document.getElementById("result");

    if (!country || !zone) {
        result.textContent = "Please select a country and zone.";
        return;
    }

    const destination = supplierData.find(item => item.country === country && item.code === zone);
    if (!destination) {
        result.textContent = "No rates found for the selected country and zone.";
        return;
    }

    const { conversion, rates } = destination;

    lines.forEach((line) => {
        const width = parseFloat(line.querySelector(".width").value) || 0;
        const length = parseFloat(line.querySelector(".length").value) || 0;
        const height = parseFloat(line.querySelector(".height").value) || 0;
        const quantity = parseInt(line.querySelector(".quantity").value, 10) || 0;
        const type = line.querySelector(".type").value;
        const cubicCapacityField = line.querySelector(".cubic-capacity");

        if (type === "box") {
            const cubicMeters = (width * length * height) / 1000000;
            const totalForLine = cubicMeters * quantity;
            totalCubicMeters += totalForLine;
            cubicCapacityField.value = totalForLine.toFixed(3);
        } else if (type === "pallet") {
            const cubicMeters = (width * length * height) / 1000000;
            const totalForLine = cubicMeters * quantity;
            totalCubicMeters += totalForLine;
            cubicCapacityField.value = totalForLine.toFixed(3);
        }
    });

    const totalWeight = totalCubicMeters * conversion.m3;
    const roundedWeight = Math.ceil(totalWeight / 100) * 100;
    const scaledWeight = roundedWeight / 100;
    const rateTier = getRateTier(totalWeight, rates);
    const calculatedCost = scaledWeight * rates[rateTier];
    const finalCost = Math.max(calculatedCost, rates.minimum);

    result.innerHTML = `
        <p>Total Cubic Meters: ${totalCubicMeters.toFixed(3)} m³</p>
        <p>Total Weight: ${totalWeight.toFixed(2)} kg</p>
        <p>Rounded Weight: ${roundedWeight} kg</p>
        <p>Scaled Weight: ${scaledWeight} (in hundreds)</p>
        <p>Final Cost: €${finalCost.toFixed(2)}</p>
    `;
}

function getRateTier(weight, rates) {
    const rateKeys = Object.keys(rates);

    for (const key of rateKeys) {
        if (key.includes('-')) {
            const [min, max] = key.split('-').map(Number);
            if (weight >= min && weight <= max) {
                return key;
            }
        } else if (key.startsWith('>')) {
            const min = Number(key.slice(1));
            if (weight > min) {
                return key;
            }
        }
    }

    return "minimum";
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
