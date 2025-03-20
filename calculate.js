document.addEventListener('DOMContentLoaded', () => {
    fetch('supplier_data.json')
        .then(response => response.json())
        .then(data => {
            const suppliers = data;
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
    fetch('supplier_data.json')
        .then(response => response.json())
        .then(data => {
            const zones = data.filter(supplier => supplier.country === country);
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
        a.onclick = () => selectZone(zone.code, zone.rates);
        zoneList.appendChild(a);
    });
}

function selectZone(zoneCode, rates) {
    document.getElementById('zone').value = zoneCode;
    document.getElementById('zone-list').style.display = 'none';
    displayRates(rates);
}

function displayRates(rates) {
    const rateContainer = document.getElementById('rate-container');
    rateContainer.innerHTML = `
        <p>Minimum: ${rates.minimum} €</p>
        <p><500 Kgs: ${rates['<500kgs']} €</p>
        <p><1000 Kgs: ${rates['<1000kgs']} €</p>
        <p><2000 Kgs: ${rates['<2000kgs']} €</p>
        <p><3000 Kgs: ${rates['<3000kgs']} €</p>
        <p><4000 Kgs: ${rates['<4000kgs']} €</p>
        <p><5000 Kgs: ${rates['<5000kgs']} €</p>
        <p>>5000 Kgs: ${rates['>5000kgs']} €</p>
    `;
}

function clearZones() {
    document.getElementById('zone').value = '';
    document.getElementById('zone-list').innerHTML = '';
    document.getElementById('rate-container').innerHTML = '';
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
