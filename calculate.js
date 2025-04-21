document.addEventListener('DOMContentLoaded', () => {
    fetch('https://raw.githubusercontent.com/hmdfurniture/Calculo/main/Tables/xbslog_international.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch JSON file: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Debugging: Confirm data loaded
            const suppliers = data.destinations || [];
            const countries = new Set();
            suppliers.forEach(supplier => countries.add(supplier.country));
            populateCountryList(Array.from(countries));
        })
        .catch(error => {
            console.error("Error fetching JSON:", error);
            document.getElementById('error-message').innerText = "Failed to load country data. Please try again later.";
        });
});

function populateCountryList(countries) {
    const countryList = document.getElementById('country-list');
    if (!countryList) {
        console.error("Element #country-list not found!");
        return;
    }

    countryList.innerHTML = ''; // Clear the previous list

    // Sort countries alphabetically
    countries.sort();

    countries.forEach(country => {
        const a = document.createElement('a');
        a.href = "#";
        a.textContent = country;
        a.onclick = () => {
            document.getElementById('country').value = country;
            loadZonesForCountry(country);
        };
        countryList.appendChild(a);
    });
}

function validateInput(input) {
    if (input.value > 999) {
        input.value = 999;
    } else if (input.value < 0) {
        input.value = 0;
    }
}

function finalCalculate() {
    const dimensionContainer = document.getElementById('dimension-container');
    if (!dimensionContainer) {
        console.error("Element #dimension-container not found!");
        return;
    }

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

        const width = parseFloat(widthInput?.value || 0);
        const length = parseFloat(lengthInput?.value || 0);
        const height = parseFloat(heightInput?.value || 0);
        const quantity = parseInt(quantityInput?.value || 0);
        const type = typeInput?.value || '';

        if (isNaN(width) || isNaN(length) || isNaN(height) || isNaN(quantity) ||
            width <= 0 || length <= 0 || height <= 0 || quantity <= 0) {

            if (width <= 0 || isNaN(width)) widthInput?.classList.add('error');
            if (length <= 0 || isNaN(length)) lengthInput?.classList.add('error');
            if (height <= 0 || isNaN(height)) heightInput?.classList.add('error');
            if (quantity <= 0 || isNaN(quantity)) quantityInput?.classList.add('error');
            
            errorMessage = '* Please fill in all required fields.';
            hasError = true;
        } else {
            const cubicCapacity = (width * length * height * quantity) / 1000000;
            let volumetricWeight = 0;

            if (type === 'box' || (type === 'pallet' && height <= 125)) {
                volumetricWeight = cubicCapacity * 300; // 1 m³ = 300 kg
            } else if (type === 'pallet' && height > 125) {
                volumetricWeight = cubicCapacity * 1750; // 1 ldm = 1750 kg
            }

            volumetricWeight = Math.ceil(volumetricWeight / 100) * 100;

            dimensionLines[i].getElementsByClassName('cubic-capacity')[0].value = volumetricWeight.toFixed(2);
            totalVolumetricWeight += volumetricWeight;

            widthInput?.classList.remove('error');
            lengthInput?.classList.remove('error');
            heightInput?.classList.remove('error');
            quantityInput?.classList.remove('error');
        }
    }

    if (hasError) {
        document.getElementById('error-message').innerText = errorMessage;
    } else {
        document.getElementById('error-message').innerText = '';
        document.getElementById('result').innerText = `Total Volumetric Weight: ${totalVolumetricWeight.toFixed(2)} kg`;
    }
}
