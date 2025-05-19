// dataLoader.js
window.supplierData = [];
window.conversionFactorsInternational = {};
window.conversionFactorsNational = {};

window.loadSupplierData = function(callback) {
    Promise.all([
        fetch('./Tables/xbslog_international.json').then(response => response.json()),
        fetch('./Tables/xbslog_nacional.json').then(response => response.json())
    ])
    .then(([internationalData, nacionalData]) => {
        window.supplierData = [
            ...internationalData.destinations,
            ...nacionalData.destinations
        ];
        window.conversionFactorsInternational = internationalData.conversion || {};
        window.conversionFactorsNational = nacionalData.conversion || {};
        if (typeof callback === "function") callback();
    })
    .catch((error) => console.error('Error loading supplier data:', error));
};
