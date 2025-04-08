document.getElementById('operation').addEventListener('change', function() {
    const operation = this.value;
    document.getElementById('add-zone-section').style.display = operation === 'add-zone' ? 'block' : 'none';
    document.getElementById('create-supplier-section').style.display = operation === 'create-supplier' ? 'block' : 'none';
});

const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN_HERE';

function addZone() {
    const supplierFile = document.getElementById('existing-supplier').value;
    const country = document.getElementById('country').value;
    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const rates = {
        minimum: parseFloat(document.getElementById('minimum').value),
        "<500kgs": parseFloat(document.getElementById('less_500kgs').value),
        "<1000kgs": parseFloat(document.getElementById('less_1000kgs').value),
        "<2000kgs": parseFloat(document.getElementById('less_2000kgs').value),
        "<3000kgs": parseFloat(document.getElementById('less_3000kgs').value),
        "<4000kgs": parseFloat(document.getElementById('less_4000kgs').value),
        "<5000kgs": parseFloat(document.getElementById('less_5000kgs').value),
        ">5000kgs": parseFloat(document.getElementById('more_5000kgs').value)
    };

    fetch(`https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables/${supplierFile}`)
        .then(response => response.json())
        .then(data => {
            const content = atob(data.content);
            const supplier = JSON.parse(content);
            supplier.destinations.push({ country, code, name, rates });

            const updatedContent = btoa(JSON.stringify(supplier, null, 2));

            return fetch(`https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables/${supplierFile}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Add new zone',
                    content: updatedContent,
                    sha: data.sha
                })
            });
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('success-message').textContent = 'Zone added successfully!';
            } else {
                throw new Error('Failed to add zone');
            }
        })
        .catch(error => {
            document.getElementById('error-message').textContent = error.message;
        });
}

function createSupplier() {
    const name = document.getElementById('supplier-name').value;
    const type = document.getElementById('supplier-type').value;
    const conversion = {
        m3: parseFloat(document.getElementById('conversion-m3').value),
        me: parseFloat(document.getElementById('conversion-me').value)
    };
    const supplier = {
        name,
        type,
        destinations: [],
        conversion
    };

    const content = btoa(JSON.stringify(supplier, null, 2));
    const filename = `Tables/${name.toLowerCase().replace(/\s+/g, '_')}.json`;

    fetch(`https://api.github.com/repos/hmdfurniture/Calculo/contents/${filename}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Create new supplier',
            content
        })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('success-message').textContent = 'Supplier created successfully!';
        } else {
            throw new Error('Failed to create supplier');
        }
    })
    .catch(error => {
        document.getElementById('error-message').textContent = error.message;
    });
}

function fetchExistingSuppliers() {
    fetch('https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables')
        .then(response => response.json())
        .then(files => {
            const select = document.getElementById('existing-supplier');
            files.forEach(file => {
                if (file.name.endsWith('.json')) {
                    const option = document.createElement('option');
                    option.value = file.name;
                    option.textContent = file.name.replace('.json', '').replace(/_/g, ' ');
                    select.appendChild(option);
                }
            });
        })
        .catch(error => {
            document.getElementById('error-message').textContent = error.message;
        });
}

// Call fetchExistingSuppliers when the page loads
window.onload = function() {
    fetchExistingSuppliers();
};
