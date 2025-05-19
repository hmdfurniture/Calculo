// dropdowns.js

window.populateCountryDropdown = function() {
    const countryList = document.getElementById("country-list");
    countryList.innerHTML = "";
    const uniqueCountries = [...new Set(window.supplierData.map(item => item.country))].sort();
    uniqueCountries.forEach(country => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = country;
        a.onclick = () => {
            window.selectCountry(country);
            window.hideDropdown("country-list");
        };
        countryList.appendChild(a);
    });
};

window.filterCountries = function() {
    const input = document.getElementById("country").value.toLowerCase();
    const countryList = document.getElementById("country-list");
    const uniqueCountries = [...new Set(window.supplierData.map(item => item.country))].sort();
    countryList.innerHTML = "";
    (input === "" ? uniqueCountries : uniqueCountries.filter(
        country => country.toLowerCase().startsWith(input)
    )).forEach(country => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = country;
        a.onclick = () => {
            window.selectCountry(country);
            window.hideDropdown("country-list");
        };
        countryList.appendChild(a);
    });
};

window.selectCountry = function(country) {
    const countryInput = document.getElementById("country");
    countryInput.value = country;
    const zoneInput = document.getElementById("zone");
    zoneInput.value = "";
    zoneInput.disabled = false;
    document.getElementById("zone-list").innerHTML = "";
    window.populateZoneDropdown(country);
    countryInput.dispatchEvent(new Event("input"));
    window.filterCountries();
};

window.populateZoneDropdown = function(country) {
    const zoneList = document.getElementById("zone-list");
    zoneList.innerHTML = "";
    const zones = window.supplierData.filter(item => item.country === country).map(item => item.code);
    const uniqueZones = [...new Set(zones)].sort();
    uniqueZones.forEach(zone => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = zone;
        a.onclick = () => {
            window.selectZone(zone);
            window.hideDropdown("zone-list");
        };
        zoneList.appendChild(a);
    });
};

window.filterZones = function() {
    const input = document.getElementById("zone").value.toLowerCase();
    const zoneList = document.getElementById("zone-list");
    const country = document.getElementById("country").value;
    const zones = window.supplierData.filter(item => item.country === country).map(item => item.code);
    const uniqueZones = [...new Set(zones)].sort();
    zoneList.innerHTML = "";
    (input === "" ? uniqueZones : uniqueZones.filter(
        zone => zone.startsWith(input)
    )).forEach(zone => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = zone;
        a.onclick = () => {
            window.selectZone(zone);
            window.hideDropdown("zone-list");
        };
        zoneList.appendChild(a);
    });
};

window.selectZone = function(zone) {
    const zoneInput = document.getElementById("zone");
    zoneInput.value = zone;
    zoneInput.dispatchEvent(new Event("input"));
    window.filterZones();
};

window.showDropdown = function(dropdownId) {
    document.getElementById(dropdownId).style.display = "block";
};
window.hideDropdown = function(dropdownId) {
    document.getElementById(dropdownId).style.display = "none";
};
