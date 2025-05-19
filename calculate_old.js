// Store the JSON data globally for easier access
let supplierData = [];
let conversionFactorsInternational = {}; // Store conversion factors for international transport
let conversionFactorsNational = {}; // Store conversion factors for national transport

// Fetch and load JSON files
function loadSupplierData() {
    // Fetch both JSON files
    Promise.all([
        fetch('./Tables/xbslog_international.json').then((response) => response.json()),
        fetch('./Tables/xbslog_nacional.json').then((response) => response.json())
    ])
        .then(([internationalData, nacionalData]) => {
            // Merge the destinations from both files
            supplierData = [
                ...internationalData.destinations,
                ...nacionalData.destinations
            ];

            // Store conversion factors separately
            conversionFactorsInternational = internationalData.conversion;
            conversionFactorsNational = nacionalData.conversion;

            // Populate the dropdown with the merged data
            populateCountryDropdown();
        })
        .catch((error) => console.error('Error loading supplier data:', error));
}

// Function to determine if the transport is international
function isInternational(country, zone) {
    return supplierData.some(
        (item) => item.country === country && item.code === zone && item.rates["<500kgs"] !== undefined
    );
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

    countryList.innerHTML = ""; // Limpa as opções anteriores

    // Caso 1: Se o campo está vazio, exibe todas as opções
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

    // Caso 2: Filtra os países com base no texto digitado
    uniqueCountries
        .filter((country) => country.toLowerCase().startsWith(input)) // Filtra países que começam com o texto digitado
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

    // Resetar o campo da zona quando o país for alterado
    const zoneInput = document.getElementById("zone");
    zoneInput.value = ""; // Limpa o valor da zona
    zoneInput.disabled = false; // Habilita o campo da zona
    const zoneList = document.getElementById("zone-list");
    zoneList.innerHTML = ""; // Limpa o dropdown de zonas

    // Atualiza a lista de zonas com base no novo país
    populateZoneDropdown(country);

    // Dispara um evento de input para qualquer lógica associada
    countryInput.dispatchEvent(new Event("input"));

    // Atualiza o dropdown para exibir apenas o valor selecionado
    filterCountries();
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

    zoneList.innerHTML = ""; // Limpa as opções anteriores

    // Caso 1: Se o campo está vazio, exibe todas as opções
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

    // Caso 2: Filtra as zonas com base no texto digitado
    uniqueZones
        .filter((zone) => zone.startsWith(input)) // Filtra zonas que começam com o texto digitado
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

    // Dispara um evento 'input' manualmente para atualizar a lógica
    zoneInput.dispatchEvent(new Event("input"));

    // Atualiza o dropdown para exibir apenas o valor selecionado
    filterZones();
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

    // Adjusted order: Type is now at the beginning of the line
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
    let hasBox = false;
    let hasPallet = false;
    let allPalletsHaveLowHeight = true;
    let allPalletsHaveHighHeight = true;
    let allLengthsValid = true;
    const result = document.getElementById("result");

    // Step 1: Check for the presence of boxes and types of pallets
    lines.forEach((line) => {
        const type = line.querySelector(".type").value;
        const height = parseFloat(line.querySelector(".height").value) || 0;
        const length = parseFloat(line.querySelector(".length").value) || 0;

        if (type === "box") {
            hasBox = true;
        } else if (type === "pallet") {
            hasPallet = true;
            if (height > 125) {
                allPalletsHaveLowHeight = false;
                if (length < 100 || length > 125) {
                    allLengthsValid = false;
                }
            } else {
                allPalletsHaveHighHeight = false;
            }
        }
    });

    // Fetch selected country and zone
    const country = document.getElementById("country").value;
    const zone = document.getElementById("zone").value;

    if (!country || !zone) {
        result.textContent = "Please select a country and zone.";
        return;
    }

    // Determine if it's international or national
    const isTransportInternational = isInternational(country, zone);

    // Choose the appropriate conversion factors
    const conversionFactors = isTransportInternational
        ? conversionFactorsInternational
        : conversionFactorsNational;

    let totalWeight, scaledWeight, rates, rateTier, cost, rateValue;

// Step 2: Calculate volumes (m³ or LDM)
if (hasPallet && !hasBox && allPalletsHaveHighHeight && allLengthsValid) {
    // Calculate LDM for all high pallets
    lines.forEach((line) => {
        const type = line.querySelector(".type").value;
        const width = parseFloat(line.querySelector(".width").value) || 0;
        const length = parseFloat(line.querySelector(".length").value) || 0;
        const quantity = parseInt(line.querySelector(".quantity").value, 10) || 0;
        const volumetricWeightField = line.querySelector(".cubic-capacity"); // Field displaying "Volume (m³)" or "LDM"

        if (type === "pallet") {
            const adjustedLength = (length >= 100 && length <= 125) ? 120 : length;
            totalLdm += (width / 240) * (adjustedLength / 100) * quantity;

            // Update the field to show "LDM"
            volumetricWeightField.value = "LDM";
        }
    });

    if (totalLdm === 0) {
        result.textContent = "Cannot calculate: No valid LDM dimensions.";
        return;
    }

    // Calculate weight for LDM
    totalWeight = totalLdm * conversionFactors.LDM;
} else {
        // Fallback to cubic meter calculation
        lines.forEach((line) => {
            const type = line.querySelector(".type").value;
            const width = parseFloat(line.querySelector(".width").value) || 0;
            const length = parseFloat(line.querySelector(".length").value) || 0;
            const height = parseFloat(line.querySelector(".height").value) || 0;
            const quantity = parseInt(line.querySelector(".quantity").value, 10) || 0;
            const cubicCapacityField = line.querySelector(".cubic-capacity");

            if (type === "box") {
                const cubicMeters = (width * length * height) / 1000000;
                const totalForLine = cubicMeters * quantity;
                totalCubicMeters += totalForLine;
                cubicCapacityField.value = totalForLine.toFixed(3);
            } else if (type === "pallet") {
                const adjustedLength = (length >= 100 && length <= 125) ? 120 : length;
                const adjustedHeight = height > 125 ? 250 : height;
                const cubicMeters = (width * adjustedLength * adjustedHeight) / 1000000;
                const totalForLine = cubicMeters * quantity;
                totalCubicMeters += totalForLine;
                cubicCapacityField.value = totalForLine.toFixed(3);
            }
        });

        if (totalCubicMeters === 0) {
            result.textContent = "Please fill in dimensions.";
            return;
        }
        totalWeight = totalCubicMeters * conversionFactors.m3;
    }

    // Find the corresponding rates
    rates = supplierData.find((item) => item.country === country && item.code === zone)?.rates;

    if (!rates) {
        result.textContent = "No rates found for the selected country and zone.";
        return;
    }

    // Logic for national transport
    if (!isTransportInternational) {
        if (totalWeight <= 50) {
            scaledWeight = 1;
            rateValue = rates["1-50"];
            cost = rates["1-50"];
        } else if (totalWeight <= 100) {
            scaledWeight = 1;
            rateValue = rates["51-100"];
            cost = rates["51-100"];
        } else if (totalWeight <= 200) {
            scaledWeight = Math.ceil(totalWeight / 100);
            rateValue = rates["101-200"];
            cost = scaledWeight * rates["101-200"];
        } else if (totalWeight <= 300) {
            scaledWeight = Math.ceil(totalWeight / 100);
            rateValue = rates["201-300"];
            cost = scaledWeight * rates["201-300"];
        } else if (totalWeight <= 500) {
            scaledWeight = Math.ceil(totalWeight / 100);
            rateValue = rates["301-500"];
            cost = scaledWeight * rates["301-500"];
        } else if (totalWeight <= 750) {
            if (totalWeight <= 700) {
                scaledWeight = Math.ceil(totalWeight / 100);
            } else {
                scaledWeight = 7;
            }
            rateValue = rates["501-750"];
            cost = scaledWeight * rates["501-750"];
        } else if (totalWeight <= 1000) {
            if (totalWeight <= 800) {
                scaledWeight = 8;
            } else {
                scaledWeight = Math.ceil(totalWeight / 100);
            }
            rateValue = rates["751-1000"];
            cost = scaledWeight * rates["751-1000"];
        } else if (totalWeight <= 2000) {
            scaledWeight = Math.ceil(totalWeight / 100);
            rateValue = rates["1001-2000"];
            cost = scaledWeight * rates["1001-2000"];
        } else if (totalWeight <= 3500) {
            scaledWeight = Math.ceil(totalWeight / 100);
            rateValue = rates["2001-3500"];
            cost = scaledWeight * rates["2001-3500"];
        } else if (totalWeight <= 5000) {
            scaledWeight = Math.ceil(totalWeight / 100);
            rateValue = rates["3501-5000"];
            cost = scaledWeight * rates["3501-5000"];
        } else {
            scaledWeight = Math.ceil(totalWeight / 100);
            rateValue = rates[">5000"];
            cost = scaledWeight * rates[">5000"];
        }
    } else {
        const roundedWeight = Math.ceil(totalWeight / 100) * 100;
        scaledWeight = roundedWeight / 100;
        rateTier = getRateTier(totalWeight, rates, isTransportInternational);
        rateValue = rates[rateTier];
        cost = scaledWeight * rateValue;
    }

    cost = cost < rates.minimum ? rates.minimum : cost;

    result.innerHTML = `
        <p>Total ${totalLdm > 0 ? "LDM" : "Cubic Meters"}: ${totalLdm > 0 ? totalLdm.toFixed(2) : totalCubicMeters.toFixed(3)} ${totalLdm > 0 ? "m" : "m³"}</p>
        <p>Total Weight: ${totalWeight.toFixed(2)} kg</p>
        ${isTransportInternational && totalLdm === 0 ? `<p>Rounded Weight: ${Math.ceil(totalWeight / 100) * 100} kg</p>` : ""}
        <p>Scaled Weight: ${scaledWeight}</p>
        <p>Rate Value: €${rateValue ? rateValue.toFixed(2) : "N/A"}</p>
        <p>Final Cost: €${cost.toFixed(2)}</p>
    `;
}
function getRateTier(weight, rates, isInternational) {
    // Excluir a chave "minimum" da lógica de seleção
    const rateKeys = Object.keys(rates).filter(key => key !== "minimum");

    if (isInternational) {
        // Ordenar as chaves para garantir que sejam processadas corretamente para internacional
        const sortedKeys = rateKeys.sort((a, b) => {
            const aValue = a.startsWith('<') ? parseInt(a.slice(1), 10) : a.startsWith('>') ? parseInt(a.slice(1), 10) : Number.MAX_SAFE_INTEGER;
            const bValue = b.startsWith('<') ? parseInt(b.slice(1), 10) : b.startsWith('>') ? parseInt(b.slice(1), 10) : Number.MAX_SAFE_INTEGER;
            return aValue - bValue;
        });

        // Loop pelas chaves ordenadas para encontrar o escalão correto
        for (const key of sortedKeys) {
            if (key.startsWith('<')) {
                const max = parseInt(key.slice(1), 10);
                if (weight <= max) {
                    return key;
                }
            } else if (key.startsWith('>')) {
                const min = parseInt(key.slice(1), 10);
                if (weight > min) {
                    return key;
                }
            }
        }
    } else {
        // Ordenar as chaves para nacional com base nos intervalos explícitos
        const sortedKeys = rateKeys.sort((a, b) => {
            const aMin = a.includes('-') ? parseInt(a.split('-')[0], 10) : a.startsWith('>') ? parseInt(a.slice(1), 10) : Number.MAX_SAFE_INTEGER;
            const bMin = b.includes('-') ? parseInt(b.split('-')[0], 10) : b.startsWith('>') ? parseInt(b.slice(1), 10) : Number.MAX_SAFE_INTEGER;
            return aMin - bMin;
        });

        // Loop pelas chaves ordenadas para encontrar o escalão correto
        for (const key of sortedKeys) {
            if (key.includes('-')) {
                const [min, max] = key.split('-').map(Number);
                if (weight >= min && weight <= max) {
                    return key;
                }
            } else if (key.startsWith('>')) {
                const min = parseInt(key.slice(1), 10);
                if (weight > min) {
                    return key;
                }
            }
        }
    }

    // Retornar "minimum" como fallback
    return "minimum";
}

// Evento para monitorar mudanças no campo de país
document.getElementById("country").addEventListener("input", () => {
    const countryInput = document.getElementById("country");
    const zoneInput = document.getElementById("zone");
    const zoneList = document.getElementById("zone-list");

    // Se o campo de país estiver vazio, reseta o campo de zona
    if (countryInput.value.trim() === "") {
        zoneInput.value = ""; // Limpa o valor da zona
        zoneInput.disabled = true; // Desativa o campo da zona
        zoneList.innerHTML = ""; // Limpa a lista de zonas
    }
});

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
