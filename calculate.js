document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables')
        .then(response => response.json())
        .then(files => {
            const jsonFiles = files.filter(file => file.name.endsWith('.json'));
            return Promise.all(jsonFiles.map(file => fetch(file.download_url).then(response => response.json())));
        })
        .then(dataArray => {
            const suppliers = [];
            dataArray.forEach(data => suppliers.push(...data.destinations));
            const countries = new Set();
            suppliers.forEach(supplier => {
                countries.add(supplier.country);
            });
            populateCountryList(Array.from(countries));
        });
});

function populateCountryList(countries) {
    const countryList = document.getElementById('country-list');
    countryList.innerHTML = ''; // Clear previous list

    // Sort countries alphabetically
    countries.sort();

    countries.forEach(country => {
        const a = document.createElement('a');
        a.href = "#";
        a.textContent = country;
        a.onclick = () => {
            selectCountry(country);
            loadZonesForCountry(country);
        };
        countryList.appendChild(a);
    });
}

function filterCountries() {
    const input = document.getElementById('country');
    const filter = input.value.toUpperCase();
    const countryList = document.getElementById('country-list');
    const a = countryList.getElementsByTagName('a');
    let count = 0;
    for (let i = 0; i < a.length; i++) {
        const txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) === 0) {
            a[i].style.display = "";
            count++;
        } else {
            a[i].style.display = "none";
        }
    }
    countryList.style.display = count > 0 ? "block" : "none";
}

function filterZones() {
    const input = document.getElementById('zone');
    const filter = input.value.toUpperCase();
    const zoneList = document.getElementById('zone-list');
    const a = zoneList.getElementsByTagName('a');
    let count = 0;
    for (let i = 0; i < a.length; i++) {
        const txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) === 0) {
            a[i].style.display = "";
            count++;
        } else {
            a[i].style.display = "none";
        }
    }
    zoneList.style.display = count > 0 ? "block" : "none";
}

function selectCountry(country) {
    document.getElementById('country').value = country;
    document.getElementById('country-list').style.display = 'none';
    document.getElementById('zone').disabled = false;
    clearZones();
}

function showDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = "block";
}

function loadZonesForCountry(country) {
    fetch('https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables')
        .then(response => response.json())
        .then(files => {
            const jsonFiles = files.filter(file => file.name.endsWith('.json'));
            return Promise.all(jsonFiles.map(file => fetch(file.download_url).then(response => response.json())));
        })
        .then(dataArray => {
            const zones = [];
            dataArray.forEach(data => {
                data.destinations.forEach(destination => {
                    if (destination.country === country) {
                        zones.push(destination);
                    }
                });
            });
            populateZoneList(zones);
        });
}

function populateZoneList(zones) {
    const zoneList = document.getElementById('zone-list');
    zoneList.innerHTML = ''; // Clear previous list

    // Sort zones alphabetically by their code or name
    zones.sort((a, b) => a.code.localeCompare(b.code)); // Or replace 'code' with the appropriate property

    zones.forEach(zone => {
        const a = document.createElement('a');
        a.href = "#";
        a.textContent = `${zone.code}`;
        a.onclick = () => selectZone(zone.code);
        zoneList.appendChild(a);
    });
}

function selectZone(zoneCode) {
    document.getElementById('zone').value = zoneCode;
    document.getElementById('zone-list').style.display = 'none';
}

function addLine() {
    const dimensionContainer = document.getElementById('dimension-container');
    const newLine = document.createElement('div');
    newLine.className = 'form-group dimension-line';
    newLine.innerHTML = `
        <div>
            <input type="number" class="width" oninput="this.value = Math.min(Math.max(this.value, 0), 999)" required>
        </div>
        <div>
            <input type="number" class="length" oninput="this.value = Math.min(Math.max(this.value, 0), 999)" required>
        </div>
        <div>
            <input type="number" class="height" oninput="this.value = Math.min(Math.max(this.value, 0), 999)" required>
        </div>
        <div>
            <input type="number" class="quantity" oninput="this.value = Math.min(Math.max(this.value, 0), 999)" required>
        </div>
        <div>
            <select class="type" required>
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
    dimensionContainer.appendChild(newLine);
}

function removeLine(button) {
    const line = button.parentNode.parentNode;
    line.parentNode.removeChild(line);
}

function calculateCubicCapacity(line) {
    const widthInput = line.getElementsByClassName('width')[0];
    const lengthInput = line.getElementsByClassName('length')[0];
    const heightInput = line.getElementsByClassName('height')[0];
    const quantityInput = line.getElementsByClassName('quantity')[0];
    const typeInput = line.getElementsByClassName('type')[0];
    const width = parseFloat(widthInput.value);
    const length = parseFloat(lengthInput.value);
    const height = parseFloat(heightInput.value);
    const quantity = parseInt(quantityInput.value);
    const type = typeInput.value;

    if (!isNaN(width) && !isNaN(length) && !isNaN(height) && !isNaN(quantity) && width > 0 && length > 0 && height > 0 && quantity > 0) {
        const cubicCapacity = (width * length * height * quantity) / 1000000;
        let volumetricWeight = 0;
        if (type === 'box' || (type === 'pallet' && height <= 125)) {
            volumetricWeight = cubicCapacity * 300; // For boxes and pallets ≤ 125 cm
        } else if (type === 'pallet' && height > 125) {
            volumetricWeight = cubicCapacity * 1750; // For pallets > 125 cm
        }
        line.getElementsByClassName('cubic-capacity')[0].value = volumetricWeight.toFixed(2);
    }
}

function finalCalculate() {
    const dimensionContainer = document.getElementById('dimension-container');
    const dimensionLines = dimensionContainer.getElementsByClassName('dimension-line');
    let totalVolumetricWeight = 0;
    let errorMessage = '';
    let hasError = false;

    for (let i = 0; i < dimensionLines.length; i++) {
        const widthInput = dimensionLines[i].getElementsByClassName('width')[0];
        const lengthInput = dimensionLines[i].getElementsByClassName('length')[0];
        const heightInput = dimensionLines[i].getElementsByClassName('height')[0];
        const quantityInput = dimensionLines[i].getElementsByClassName('quantity')[0];
        const typeInput = dimensionLines[i].getElementsByClassName('type')[0];

        const width = parseFloat(widthInput.value);
        const length = parseFloat(lengthInput.value);
        const height = parseFloat(heightInput.value);
        const quantity = parseInt(quantityInput.value);
        const type = typeInput.value;

        if (isNaN(width) || isNaN(length) || isNaN(height) || isNaN(quantity) || width <= 0 || length <= 0 || height <= 0 || quantity <= 0) {
            if (width <= 0 || isNaN(width)) widthInput.classList.add('error');
            if (length <= 0 || isNaN(length)) lengthInput.classList.add('error');
            if (height <= 0 || isNaN(height)) heightInput.classList.add('error');
            if (quantity <= 0 || isNaN(quantity)) quantityInput.classList.add('error');
            errorMessage = '* Please fill in the mandatory fields.';
            hasError = true;
        } else {
            const cubicCapacity = (width * length * height * quantity) / 1000000;
            let volumetricWeight = 0;
            if (type === 'box' || (type === 'pallet' && height <= 125)) {
                volumetricWeight = cubicCapacity * 300; // For boxes and pallets ≤ 125 cm
            } else if (type === 'pallet' && height > 125) {
                volumetricWeight = cubicCapacity * 1750; // For pallets > 125 cm
            }
            dimensionLines[i].getElementsByClassName('cubic-capacity')[0].value = volumetricWeight.toFixed(2);
            totalVolumetricWeight += volumetricWeight;
            widthInput.classList.remove('error');
            lengthInput.classList.remove('error');
            heightInput.classList.remove('error');
            quantityInput.classList.remove('error');
        }
    }

    if (hasError) {
        document.getElementById('error-message').innerText = errorMessage;
    } else {
        document.getElementById('error-message').innerText = '';
        document.getElementById('result').innerText = `Total Volumetric Weight: ${totalVolumetricWeight.toFixed(2)} kg`;

        const country = document.getElementById('country').value;
        const zone = document.getElementById('zone').value;
        calculateShippingCost(totalVolumetricWeight, country, zone);
    }
}

function clearZones() {
    document.getElementById('zone').value = '';
    document.getElementById('zone-list').innerHTML = '';
    document.getElementById('result').innerHTML = '';
}

function logout() {
    // Remove the session token from local storage
    localStorage.removeItem('sessionToken');

    // Redirect to the login page
    window.location.href = 'index.html';
}

// Check if the user is logged in
window.onload = function() {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
        // Redirect to the login page
        window.location.href = 'index.html';
    }
}

// Hide dropdown when clicking outside
window.addEventListener('click', function(e) {
    const countryInput = document.getElementById('country');
    const countryList = document.getElementById('country-list');
    const zoneInput = document.getElementById('zone');
    const zoneList = document.getElementById('zone-list');

    if (!countryInput.contains(e.target) && !countryList.contains(e.target)) {
        countryList.style.display = 'none';
    }

    if (!zoneInput.contains(e.target) && !zoneList.contains(e.target)) {
        zoneList.style.display = 'none';
    }
});
