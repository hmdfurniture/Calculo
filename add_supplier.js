const GITHUB_TOKEN = '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';

function fetchSupplierFile(supplierFile) {
    return fetch(`https://api.github.com/repos/hmdfurniture/Calculo/contents/Tables/${supplierFile}`)
        .then(response => response.json())
        .then(data => {
            const content = JSON.parse(atob(data.content));
            content.sha = data.sha; // Include SHA
            return content;
        });
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
    document.getElementById('operation').addEventListener('change', function () {
        const operation = this.value;

        document.getElementById('add-zone-section').style.display = 'none';

        if (operation === 'add-zone') {
            document.getElementById('add-zone-section').style.display = 'block';
        }
    });
}

window.onload = initialize;
