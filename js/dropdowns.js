// Função utilitária para validação case-insensitive
function matchDropdownValue(inputValue, dropdownArray) {
    const normalizedInput = inputValue.trim().toLowerCase();
    return dropdownArray.find(opt => opt.toLowerCase() === normalizedInput) || null;
}

// Mensagens de erro centralizadas no #result (mesmo sítio que os outros erros do main.js)
function showError(msg) {
    const resultDiv = document.getElementById('result');
    if (resultDiv) resultDiv.innerHTML = `<p>${msg}</p>`;
    // Limpa mensagens/contexto associadas ao cálculo
    const mensagensDiv = document.getElementById('mensagens');
    if (mensagensDiv) mensagensDiv.innerHTML = '';
}
function hideError() {
    const resultDiv = document.getElementById('result');
    if (resultDiv) resultDiv.innerHTML = '';
}

// ---- PAISES ----
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
    const input = document.getElementById("country").value.toLowerCase();
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

// Validação ao perder o foco ou carregar ENTER (país)
document.getElementById('country').addEventListener('blur', function() {
    const uniqueCountries = [...new Set(supplierData.map((item) => item.country))];
    const input = this.value;
    const matched = matchDropdownValue(input, uniqueCountries);
    if (!matched) {
        showError('Nenhum destino/Zona disponível.');
        this.value = '';
        document.getElementById("zone").value = "";
        document.getElementById("zone").disabled = true;
        document.getElementById("zone-list").innerHTML = "";
        // Limpa outros blocos de resultados/contexto já feito no showError
    } else {
        this.value = matched;
        hideError();
        this.dispatchEvent(new Event('change', {bubbles: true}));
        document.getElementById("zone").disabled = false;
    }
});
document.getElementById('country').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') this.blur();
});

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
    // PATCH para disparar o evento de mapa:
    countryInput.dispatchEvent(new Event("change"));
    filterCountries();
}

// ---- ZONAS ----
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
    const input = document.getElementById("zone").value.toLowerCase();
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
        .filter((zone) => zone.toLowerCase().startsWith(input))
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

// Validação ao perder o foco ou carregar ENTER (zona)
document.getElementById('zone').addEventListener('blur', function() {
    const country = document.getElementById("country").value;
    const zones = supplierData
        .filter((item) => item.country === country)
        .map((item) => item.code);
    const uniqueZones = [...new Set(zones)];

    const input = this.value;
    const matched = matchDropdownValue(input, uniqueZones);
    if (!matched) {
        showError('Nenhum destino/Zona disponível.');
        this.value = '';
        destacarNoMapa(null);
    } else {
        this.value = matched;
        hideError();
        this.dispatchEvent(new Event('change', {bubbles: true}));
    }
});
document.getElementById('zone').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') this.blur();
});

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
