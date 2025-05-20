const GITHUB_TOKEN = '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';

function fetchSupplierFiles() {
    return fetch('https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables', {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch supplier files. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(files => files.filter(file => file.name.endsWith('.json')))
        .catch(error => {
            console.error('Error fetching supplier files:', error.message);
            throw error; // Re-throw error for further handling
        });
}

function populateDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="" disabled selected>Select a supplier</option>';

    fetchSupplierFiles()
        .then(files => {
            if (files.length === 0) {
                throw new Error('No supplier files found.');
            }
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file.name;
                option.textContent = file.name.replace('.json', '').replace(/_/g, ' ');
                dropdown.appendChild(option);
            });
        })
        .catch(error => {
            document.getElementById('error-message').textContent = `Error fetching suppliers: ${error.message}`;
        });
}

function initialize() {
    const operationDropdown = document.getElementById('operation');
    operationDropdown.addEventListener('change', function () {
        const operation = this.value;

        // Hide all sections
        ['add-zone-section', 'edit-zone-section', 'remove-zone-section', 'create-supplier-section'].forEach(section => {
            document.getElementById(section).style.display = 'none';
        });

        // Show relevant section and populate dropdown
        if (operation === 'add-zone') {
            document.getElementById('add-zone-section').style.display = 'block';
            populateDropdown('existing-supplier');
        } else if (operation === 'edit-zone') {
            document.getElementById('edit-zone-section').style.display = 'block';
            populateDropdown('existing-supplier-edit');
        } else if (operation === 'remove-zone') {
            document.getElementById('remove-zone-section').style.display = 'block';
            populateDropdown('existing-supplier-remove');
        }
    });

    // Hide all sections on page load
    ['add-zone-section', 'edit-zone-section', 'remove-zone-section', 'create-supplier-section'].forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
}

window.onload = initialize;
