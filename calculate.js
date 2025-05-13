// Store the JSON data globally for easier access
let supplierData = [];
let internationalConversion = {};
let nationalConversion = {}; // Separate conversion factors for international/national

// Fetch and load JSON files
function loadSupplierData() {
    // Fetch both JSON files
    Promise.all([
        fetch('./Tables/xbslog_international.json').then((response) => response.json()),
        fetch('./Tables/xbslog_nacional.json').then((response) => response.json())
    ])
        .then(([internationalData, nacionalData]) => {
            // Merge the destinations
            supplierData = [
                ...internationalData.destinations.map(item => ({ ...item, type: 'International' })),
                ...nacionalData.destinations.map(item => ({ ...item, type: 'National' }))
            ];

            // Store conversion factors separately
            internationalConversion = internationalData.conversion;
            nationalConversion = nacionalData.conversion;

            // Populate the dropdown with the merged data
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

// Function to calculate results
function calculateResults() {
    const lines = document.querySelectorAll(".dimension-line");
    let totalCubicMeters = 0;
    let totalLdm = 0;
    const result = document.getElementById("result");
    const country = document.getElementById("country").value;
    const zone = document.getElementById("zone").value;

    if (!country || !zone) {
        result.textContent = "Please select a country and zone.";
        return;
    }

    // Determine if the selected country is international or national
    const selectedType = supplierData.find(item => item.country === country)?.type;
    const conversion = selectedType === 'International' ? internationalConversion : nationalConversion;

    // Calculate volumes (m³ or LDM)
    lines.forEach((line) => {
        const width = parseFloat(line.querySelector(".width").value) || 0;
        const length = parseFloat(line.querySelector(".length").value) || 0;
        const height = parseFloat(line.querySelector(".height").value) || 0;
        const quantity = parseInt(line.querySelector(".quantity").value, 10) || 0;

        const cubicMeters = (width * length * height) / 1000000;
        totalCubicMeters += cubicMeters * quantity;
    });

    const totalWeight = totalCubicMeters * conversion.m3; // Use the appropriate conversion factor
    const roundedWeight = Math.ceil(totalWeight / 100) * 100;

    // Fetch rates for the selected country and zone
    const rates = supplierData.find(item => item.country === country && item.code === zone)?.rates;

    if (rates) {
        const rateTier = getRateTier(roundedWeight, rates);
        const calculatedCost = (roundedWeight / 100) * rates[rateTier];
        const finalCost = calculatedCost < rates.minimum ? rates.minimum : calculatedCost;

        result.innerHTML = `
            <p>Total Cubic Meters: ${totalCubicMeters.toFixed(3)} m³</p>
            <p>Total Weight: ${totalWeight.toFixed(2)} kg</p>
            <p>Rounded Weight: ${roundedWeight} kg</p>
            <p>Final Cost: €${finalCost.toFixed(2)}</p>
        `;
    } else {
        result.textContent = "No rates found for the selected country and zone.";
    }
}

// Determine the appropriate rate tier for the weight
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

    // Default to "minimum" if no range matches
    return "minimum";
}

// Load supplier data on page load
window.onload = loadSupplierData;
