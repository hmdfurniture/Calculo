document.addEventListener('DOMContentLoaded', () => {
    const supplierFiles = ['xbslog_international.json', 'xbslog_national.json'];
    const suppliers = [];

    Promise.all(supplierFiles.map(file => fetch(file).then(response => response.json())))
        .then(dataArray => {
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
    const supplierFiles = ['xbslog_international.json', 'xbslog_national.json'];
    const suppliers = [];

    Promise.all(supplierFiles.map(file => fetch(file).then(response => response.json())))
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
            <input type="number" class="width" min="0" max="999" oninput="calculateCubicCapacity(this)" required>
        </div>
        <div>
            <input type="number" class="length" min="0" max="999" oninput="calculateCubicCapacity(this)" required>
        </div>
        <div>
            <input type="number" class="height" min="0" max="999" oninput="calculateCubicCapacity(this)" required>
        </div>
        <div>
            <input type="number" class="quantity" min="0" max="999" oninput="calculateCubicCapacity(this)" required>
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

function calculateCubicCapacity(input) {
    const line = input.parentNode.parentNode;
    const widthInput = line.getElementsByClassName('width')[0];
    const lengthInput = line.getElementsByClassName('length')[0];
    const heightInput = line.getElementsByClassName('height')[0];
    const quantityInput = line.getElementsByClassName('quantity')[0];
    const width = parseFloat(widthInput.value) / 100;
    const length = parseFloat(lengthInput.value) / 100;
    const height = parseFloat(heightInput.value) / 100;
    const quantity = parseInt(quantityInput.value);
    
    if (!isNaN(width) && !isNaN(length) && !isNaN(height) && !isNaN(quantity)) {
        const cubicCapacity = width * length * height * quantity;
        line.getElementsByClassName('cubic-capacity')[0].value = cubicCapacity.toFixed(2);
    }
}

function finalCalculate() {
    const dimensionContainer = document.getElementById('dimension-container');
    const dimensionLines = dimensionContainer.getElementsByClassName('dimension-line');
    let totalCubicCapacity = 0;
    let errorMessage = '';
    let hasError = false;

    for (let i = 0; i < dimensionLines.length; i++) {
        const widthInput = dimensionLines[i].getElementsByClassName('width')[0];
        const lengthInput = dimensionLines[i].getElementsByClassName('length')[0];
        const heightInput = dimensionLines[i].getElementsByClassName('height')[0];
        const quantityInput = dimensionLines[i].getElementsByClassName('quantity')[0];
        
        const width = parseFloat(widthInput.value) / 100;
        const length = parseFloat(lengthInput.value) / 100;
        const height = parseFloat(heightInput.value) / 100;
        const quantity = parseInt(quantityInput.value);

        if (isNaN(width) || isNaN(length) || isNaN(height) || isNaN(quantity) || widthInput.value === '' || lengthInput.value === '' || heightInput.value === '' || quantityInput.value === '') {
            widthInput.classList.add('error');
            lengthInput.classList.add('error');
            heightInput.classList.add('error');
            quantityInput.classList.add('error');
            errorMessage = '* Please fill in the mandatory fields.';
            hasError = true;
        } else {
            const cubicCapacity = width * length * height * quantity;
            dimensionLines[i].getElementsByClassName('cubic-capacity')[0].value = cubicCapacity.toFixed(2);
            totalCubicCapacity += cubicCapacity;
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
        document.getElementById('result').innerText = `Total Cubic Capacity: ${totalCubicCapacity.toFixed(2)} m³`;
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
