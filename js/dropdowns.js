// --- dropdowns.js ---
// Dropdowns de países e zonas com filtro tolerante (ignora acentos, maiúsculas, ç)

function normalizarTexto(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s]/gi, '')
        .trim();
}

function populateCountryDropdown() {
    const countryList = document.getElementById("country-list");
    countryList.innerHTML = "";

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

function filterCountries() {
    const input = normalizarTexto(document.getElementById("country").value);
    const countryList = document.getElementById("country-list");
    const uniqueCountries = [...new Set(supplierData.map((item) => item.country))].sort();

    countryList.innerHTML = "";

    if (input === "") {
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
        return;
    }

    uniqueCountries
        .filter((country) => normalizarTexto(country).startsWith(input))
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

function selectCountry(country) {
    const countryInput = document.getElementById("country");
    countryInput.value = country;

    const zoneInput = document.getElementById("zone");
    zoneInput.value = "";
    zoneInput.disabled = false;
    const zoneList = document.getElementById("zone-list");
    zoneList.innerHTML = "";

    populateZoneDropdown(country);

    countryInput.dispatchEvent(new Event("input"));
    countryInput.dispatchEvent(new Event("change"));
    filterCountries();
}

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

function filterZones() {
    const input = normalizarTexto(document.getElementById("zone").value);
    const zoneList = document.getElementById("zone-list");
    const country = document.getElementById("country").value;

    const zones = supplierData
        .filter((item) => item.country === country)
        .map((item) => item.code);

    const uniqueZones = [...new Set(zones)].sort();

    zoneList.innerHTML = "";

    if (input === "") {
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
        return;
    }

    uniqueZones
        .filter((zone) => normalizarTexto(zone).startsWith(input))
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

function selectZone(zone) {
    const zoneInput = document.getElementById("zone");
    zoneInput.value = zone;
    zoneInput.dispatchEvent(new Event("input"));
    filterZones();
}

function showDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = "block";
}

function hideDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = "none";
}
