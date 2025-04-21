document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables')
        .then(response => response.json())
        .then(files => {
            const jsonFiles = files.filter(file => file.name.endsWith('.json'));
            console.log(jsonFiles); // Depuração para ver os ficheiros encontrados

            if (jsonFiles.length > 0) {
                return Promise.all(jsonFiles.map(file =>
                    fetch(file.download_url).then(response => response.json())
                ));
            } else {
                console.error("Nenhum ficheiro JSON encontrado.");
                return [];
            }
        })
        .then(dataArray => {
            console.log(dataArray); // Confirma se os dados foram carregados
            const suppliers = [];
            dataArray.forEach(data => suppliers.push(...data.destinations));
            const countries = new Set();
            suppliers.forEach(supplier => {
                countries.add(supplier.country);
            });
            populateCountryList(Array.from(countries));
        })
        .catch(error => console.error("Erro ao buscar JSON:", error));
});

function populateCountryList(countries) {
    const countryList = document.getElementById('country-list');
    countryList.innerHTML = ''; // Limpa a lista anterior

    if (!countryList) {
        console.error("Elemento country-list não encontrado!");
        return;
    }

    // Ordena os países alfabeticamente
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

// Função corrigida para limitar os inputs numéricos a 3 dígitos
function validateInput(input) {
    if (input.value > 999) {
        input.value = 999;
    } else if (input.value < 0) {
        input.value = 0;
    }
}

// Função para exibir dropdown corretamente
function showDropdown(id) {
    const dropdown = document.getElementById(id);
    if (dropdown) {
        dropdown.style.display = "block";
    } else {
        console.error(`Elemento ${id} não encontrado.`);
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

        if (isNaN(width) || isNaN(length) || isNaN(height) || isNaN(quantity) ||
            width <= 0 || length <= 0 || height <= 0 || quantity <= 0) {

            if (width <= 0 || isNaN(width)) widthInput.classList.add('error');
            if (length <= 0 || isNaN(length)) lengthInput.classList.add('error');
            if (height <= 0 || isNaN(height)) heightInput.classList.add('error');
            if (quantity <= 0 || isNaN(quantity)) quantityInput.classList.add('error');
            
            errorMessage = '* Por favor, preencha os campos obrigatórios.';
            hasError = true;
        } else {
            const cubicCapacity = (width * length * height * quantity) / 1000000;
            let volumetricWeight = 0;

            if (type === 'box' || (type === 'pallet' && height <= 125)) {
                volumetricWeight = cubicCapacity * 300; // 1 m³ = 300 kg
            } else if (type === 'pallet' && height > 125) {
                volumetricWeight = cubicCapacity * 1750; // 1 ldm = 1750 kg
            }

            // Arredonda para o próximo múltiplo de 100
            volumetricWeight = Math.ceil(volumetricWeight / 100) * 100;

            dimensionLines[i].getElementsByClassName('cubic-capacity')[0].value = volumetricWeight.toFixed(2);
            totalVolumetricWeight += volumetricWeight;

            // Remove a classe de erro se os campos estiverem preenchidos corretamente
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
