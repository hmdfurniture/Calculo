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

// Function to handle dynamic filtering for the country dropdown
function filterCountries() {
    const input = document.getElementById("country").value.toLowerCase();
    const countryList = document.getElementById("country-list");
    const uniqueCountries = [...new Set(supplierData.map((item) => item.country))].sort();

    countryList.innerHTML = ""; // Clear previous options

    uniqueCountries
        .filter((country) => country.toLowerCase().startsWith(input))
        .forEach((country) => {
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

// Function to handle dynamic filtering for the zone dropdown
function filterZones() {
    const input = document.getElementById("zone").value.toLowerCase();
    const zoneList = document.getElementById("zone-list");
    const country = document.getElementById("country").value;

    const zones = supplierData
        .filter((item) => item.country === country)
        .map((item) => item.code);

    const uniqueZones = [...new Set(zones)].sort();

    zoneList.innerHTML = ""; // Clear previous options

    uniqueZones
        .filter((zone) => zone.startsWith(input))
        .forEach((zone) => {
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
