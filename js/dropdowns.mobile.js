// Popula <select id="country"> e <select id="zone"> usando supplierData
// supplierData é carregado por dataLoader.js, que deve chamar populateCountryDropdown() após o load

function populateCountryDropdown() {
    const countrySelect = document.getElementById("country");
    const uniqueCountries = [...new Set(supplierData.map(item => item.country))].sort();

    countrySelect.innerHTML = '<option value="">Selecione...</option>';
    uniqueCountries.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    const zoneSelect = document.getElementById("zone");
    zoneSelect.innerHTML = '';
    zoneSelect.disabled = true;
}

function populateZoneDropdown(country) {
    const zoneSelect = document.getElementById("zone");
    const zones = supplierData.filter(item => item.country === country).map(item => item.code);
    const uniqueZones = [...new Set(zones)].sort();

    zoneSelect.innerHTML = '<option value="">Selecione...</option>';
    uniqueZones.forEach(zone => {
        const option = document.createElement("option");
        option.value = zone;
        option.textContent = zone;
        zoneSelect.appendChild(option);
    });
    zoneSelect.disabled = false;
}

// Quando o país muda, popula zonas
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("country").onchange = function() {
        const country = this.value;
        if (country) {
            populateZoneDropdown(country);
        } else {
            const zoneSelect = document.getElementById("zone");
            zoneSelect.innerHTML = '';
            zoneSelect.disabled = true;
        }
    };
});
