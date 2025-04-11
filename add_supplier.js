const GITHUB_TOKEN = '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';

function fetchSupplierFiles() {
    return fetch('https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables', {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
    })
        .then(response => response.json())
        .then(files => files.filter(file => file.name.endsWith('.json')));
}

function populateDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="" disabled selected>Select a supplier</option>';

    fetchSupplierFiles()
        .then(files => {
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
    document.getElementById('operation').addEventListener('change', function () {
        const operation = this.value;

        const sections = ['add-zone-section', 'edit-zone-section', 'remove-zone-section', 'create-supplier-section'];
        sections.forEach(section => {
            document.getElementById(section).style.display = 'none';
        });

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
}

window.onload = initialize;
