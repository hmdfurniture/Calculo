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
            <input type="text" class="width" required>
        </div>
        <div>
            <input type="text" class="length" required>
        </div>
        <div>
            <input type="text" class="height" required>
        </div>
        <div>
            <input type="text" class="quantity" required>
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

function finalCalculate() {
    const dimensionContainer = document.getElementById('dimension-container');
    const dimensionLines = dimensionContainer.getElementsByClassName('dimension-line');
    let totalCubicCapacity = 0;

    for (let i = 0; i < dimensionLines.length; i++) {
        const width = parseFloat(dimensionLines[i].getElementsByClassName('width')[0].value) / 100;
        const length = parseFloat(dimensionLines[i].getElementsByClassName('length')[0].value) / 100;
        const height = parseFloat(dimensionLines[i].getElementsByClassName('height')[0].value) / 100;
        const quantity = parseInt(dimensionLines[i].getElementsByClassName('quantity')[0].value);
        const cubicCapacity = width * length * height * quantity;
        dimensionLines[i].getElementsByClassName('cubic-capacity')[0].value = cubicCapacity.toFixed(2);
        totalCubicCapacity += cubicCapacity;
    }

    document.getElementById('result').innerText = `Total Cubic Capacity: ${totalCubicCapacity.toFixed(2)} m³`;
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
