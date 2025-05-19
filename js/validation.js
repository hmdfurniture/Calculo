// validation.js

window.validateInput = function(input) {
    input.value = input.value.replace(/\D/g, '');
    if (input.value.length > 3) input.value = input.value.slice(0, 3);
};

window.highlightField = function(field) {
    field.classList.add("highlight");
};
window.removeHighlight = function(field) {
    field.classList.remove("highlight");
};

window.finalCalculate = function() {
    const lines = document.querySelectorAll(".dimension-line");
    let allValid = true;
    lines.forEach(line => {
        const width = line.querySelector(".width");
        const length = line.querySelector(".length");
        const height = line.querySelector(".height");
        const quantity = line.querySelector(".quantity");
        const type = line.querySelector(".type");
        if (!width.value) { window.highlightField(width); allValid = false; } else window.removeHighlight(width);
        if (!length.value) { window.highlightField(length); allValid = false; } else window.removeHighlight(length);
        if (!height.value) { window.highlightField(height); allValid = false; } else window.removeHighlight(height);
        if (!quantity.value) { window.highlightField(quantity); allValid = false; } else window.removeHighlight(quantity);
        if (!type.value) { window.highlightField(type); allValid = false; } else window.removeHighlight(type);
    });
    const errorMessage = document.getElementById("error-message");
    if (!allValid) errorMessage.textContent = "Please fill in all the required fields.";
    else { errorMessage.textContent = ""; window.calculateResults(); }
};
