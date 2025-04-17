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
            volumetricWeight = cubicCapacity * 300; // 1 m³ = 300 kg
        } else if (type === 'pallet' && height > 125) {
            volumetricWeight = cubicCapacity * 1750; // 1 ldm = 1750 kg
        }

        // Round up to the nearest hundred
        volumetricWeight = Math.ceil(volumetricWeight / 100) * 100;

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
                volumetricWeight = cubicCapacity * 300; // 1 m³ = 300 kg
            } else if (type === 'pallet' && height > 125) {
                volumetricWeight = cubicCapacity * 1750; // 1 ldm = 1750 kg
            }

            // Round up to the nearest hundred
            volumetricWeight = Math.ceil(volumetricWeight / 100) * 100;

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
