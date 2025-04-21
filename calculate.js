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

function showDropdown(id) {
    const dropdown = document.getElementById(id);
    if (dropdown) {
        dropdown.style.display = "block";
    } else {
        console.error(`Dropdown with ID '${id}' not found.`);
    }
}

function removeHighlight(element) {
    if (element.classList.contains('highlight')) {
        element.classList.remove('highlight');
    }
}

function addLine() {
    const dimensionContainer = document.getElementById('dimension-container');
    if (!dimensionContainer) {
        console.error("Element #dimension-container not found!");
        return;
    }

    const newLine = document.createElement('div');
    newLine.className = 'form-group dimension-line';
    newLine.innerHTML = `
        <div><input type="number" class="width" min="0" max="999" oninput="validateInput(this)"></div>
        <div><input type="number" class="length" min="0" max="999" oninput="validateInput(this)"></div>
        <div><input type="number" class="height" min="0" max="999" oninput="validateInput(this)"></div>
        <div><input type="number" class="quantity" min="0" max="999" oninput="validateInput(this)"></div>
        <div>
            <select class="type" oninput="removeHighlight(this)">
                <option value="box">Box</option>
                <option value="pallet">Pallet</option>
            </select>
        </div>
        <div><input type="text" class="cubic-capacity" readonly></div>
        <div><button class="remove-button" onclick="removeLine(this)">Remove</button></div>
    `;
    dimensionContainer.appendChild(newLine);
}

function removeLine(button) {
    const line = button.closest('.dimension-line');
    if (line) {
        line.remove();
    }
}

function validateInput(input) {
    if (input.value > 999) {
        input.value = 999;
    } else if (input.value < 0) {
        input.value = 0;
    }
}

// Other existing functions (populateCountryList, finalCalculate, etc.) remain unchanged.
