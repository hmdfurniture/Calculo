document.addEventListener('DOMContentLoaded', () => {
    fetch('destinations.json')
        .then(response => response.json())
        .then(data => {
            const destinationSelect = document.getElementById('destination');
            data.destinations.forEach(destination => {
                const option = document.createElement('option');
                option.value = destination.code;
                option.textContent = `${destination.country} (${destination.code})`;
                destinationSelect.appendChild(option);
            });
        });
});

function calculate() {
    const width = parseFloat(document.getElementById('width').value);
    const length = parseFloat(document.getElementById('length').value);
    const height = parseFloat(document.getElementById('height').value);
    const destination = document.getElementById('destination').value;

    if (isNaN(width) || isNaN(length) || isNaN(height)) {
        alert('Please enter valid numbers for width, length, and height.');
        return;
    }

    const cubicCapacity = width * length * height / 1000000; // in cubic meters
    const volumetricWeight = cubicCapacity * 167; // assuming volumetric weight factor is 167

    fetch('destinations.json')
        .then(response => response.json())
        .then(data => {
            const destinationData = data.destinations.find(dest => dest.code === destination);
            const value = cubicCapacity * destinationData.rate;

            document.getElementById('result').innerHTML = `
                <p>Cubic Capacity: ${cubicCapacity.toFixed(2)} m³</p>
                <p>Volumetric Weight: ${volumetricWeight.toFixed(2)} kg</p>
                <p>Value for destination ${destinationData.country} (${destination}): ${value.toFixed(2)}</p>
            `;
        });
}
