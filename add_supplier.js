const GITHUB_TOKEN = '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';

function fetchSupplierFile(supplierFile) {
    return fetch(`https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables/${supplierFile}`)
        .then(response => response.json())
        .then(data => JSON.parse(atob(data.content)));
}

function populateCountriesAndZones(supplierData) {
    const countrySelect = document.getElementById('country-edit');
    const zoneSelect = document.getElementById('existing-zone');

    countrySelect.innerHTML = '';
    const countries = new Set();
    supplierData.destinations.forEach(destination => {
        countries.add(destination.country);
    });

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    countrySelect.addEventListener('change', function () {
        const selectedCountry = this.value;
        const zones = supplierData.destinations.filter(destination => destination.country === selectedCountry);

        zoneSelect.innerHTML = '';
        zones.forEach((zone, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${zone.code} - ${zone.name}`;
            zoneSelect.appendChild(option);
        });
    });

    zoneSelect.addEventListener('change', function () {
        const selectedIndex = this.value;
        const selectedZone = supplierData.destinations[selectedIndex];
        if (selectedZone) {
            document.getElementById('country-edit').value = selectedZone.country;
            document.getElementById('code-edit').value = selectedZone.code;
            document.getElementById('name-edit').value = selectedZone.name;
            document.getElementById('minimum-edit').value = selectedZone.rates.minimum;
            document.getElementById('less_500kgs-edit').value = selectedZone.rates['<500kgs'];
            document.getElementById('less_1000kgs-edit').value = selectedZone.rates['<1000kgs'];
            document.getElementById('less_2000kgs-edit').value = selectedZone.rates['<2000kgs'];
            document.getElementById('less_3000kgs-edit').value = selectedZone.rates['<3000kgs'];
            document.getElementById('less_4000kgs-edit').value = selectedZone.rates['<4000kgs'];
            document.getElementById('less_5000kgs-edit').value = selectedZone.rates['<5000kgs'];
            document.getElementById('more_5000kgs-edit').value = selectedZone.rates['>5000kgs'];
        }
    });
}

function addZone(supplierFile, supplierData) {
    const country = document.getElementById('country').value;
    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const rates = {
        minimum: parseFloat(document.getElementById('minimum').value),
        '<500kgs': parseFloat(document.getElementById('less_500kgs').value),
        '<1000kgs': parseFloat(document.getElementById('less_1000kgs').value),
        '<2000kgs': parseFloat(document.getElementById('less_2000kgs').value),
        '<3000kgs': parseFloat(document.getElementById('less_3000kgs').value),
        '<4000kgs': parseFloat(document.getElementById('less_4000kgs').value),
        '<5000kgs': parseFloat(document.getElementById('less_5000kgs').value),
        '>5000kgs': parseFloat(document.getElementById('more_5000kgs').value)
    };

    supplierData.destinations.push({ country, code, name, rates });

    updateSupplierFile(supplierFile, supplierData, 'Add new zone');
}

function editZone(supplierFile, supplierData) {
    const zoneIndex = document.getElementById('existing-zone').value;
    const country = document.getElementById('country-edit').value;
    const code = document.getElementById('code-edit').value;
    const name = document.getElementById('name-edit').value;
    const rates = {
        minimum: parseFloat(document.getElementById('minimum-edit').value),
        '<500kgs': parseFloat(document.getElementById('less_500kgs-edit').value),
        '<1000kgs': parseFloat(document.getElementById('less_1000kgs-edit').value),
        '<2000kgs': parseFloat(document.getElementById('less_2000kgs-edit').value),
        '<3000kgs': parseFloat(document.getElementById('less_3000kgs-edit').value),
        '<4000kgs': parseFloat(document.getElementById('less_4000kgs-edit').value),
        '<5000kgs': parseFloat(document.getElementById('less_5000kgs-edit').value),
        '>5000kgs': parseFloat(document.getElementById('more_5000kgs-edit').value)
    };

    supplierData.destinations[zoneIndex] = { country, code, name, rates };

    updateSupplierFile(supplierFile, supplierData, 'Edit existing zone');
}

function updateSupplierFile(supplierFile, supplierData, message) {
    const updatedContent = btoa(JSON.stringify(supplierData, null, 2));

    fetch(`https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables/${supplierFile}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            content: updatedContent,
            sha: supplierData.sha
        })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('success-message').textContent = `${message} successfully!`;
        } else {
            throw new Error('Failed to update supplier file');
        }
    })
    .catch(error => {
        document.getElementById('error-message').textContent = error.message;
    });
}

function initialize() {
    document.getElementById('existing-supplier').addEventListener('change', function () {
        const supplierFile = this.value;
        fetchSupplierFile(supplierFile).then(supplierData => {
            populateCountriesAndZones(supplierData);
        });
    });
}

window.onload = initialize;
