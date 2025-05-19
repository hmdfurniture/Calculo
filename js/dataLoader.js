let supplierData = [];
let conversionFactorsInternational = {};
let conversionFactorsNational = {};

function loadSupplierData() {
    Promise.all([
        fetch('./Tables/xbslog_international.json').then((response) => response.json()),
        fetch('./Tables/xbslog_nacional.json').then((response) => response.json())
    ])
    .then(([internationalData, nacionalData]) => {
        supplierData = [
            ...internationalData.destinations,
            ...nacionalData.destinations
        ];
        conversionFactorsInternational = internationalData.conversion;
        conversionFactorsNational = nacionalData.conversion;
        populateCountryDropdown();
    })
    .catch((error) => console.error('Error loading supplier data:', error));
}

function isInternational(country, zone) {
    return supplierData.some(
        (item) => item.country === country && item.code === zone && item.rates["<500kgs"] !== undefined
    );
}
