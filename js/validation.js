function validateInput(input) {
    input.value = input.value.replace(/\D/g, '');

    if (input.value.length > 3) {
        input.value = input.value.slice(0, 3);
    }
}

function finalCalculate() {
    const lines = document.querySelectorAll(".dimension-line");
    let allValid = true;

    lines.forEach((line) => {
        const width = line.querySelector(".width");
        const length = line.querySelector(".length");
        const height = line.querySelector(".height");
        const quantity = line.querySelector(".quantity");
        const type = line.querySelector(".type");

        if (!width.value) {
            highlightField(width);
            allValid = false;
        } else {
            removeHighlight(width);
        }

        if (!length.value) {
            highlightField(length);
            allValid = false;
        } else {
            removeHighlight(length);
        }

        if (!height.value) {
            highlightField(height);
            allValid = false;
        } else {
            removeHighlight(height);
        }

        if (!quantity.value) {
            highlightField(quantity);
            allValid = false;
        } else {
            removeHighlight(quantity);
        }

        if (!type.value) {
            highlightField(type);
            allValid = false;
        } else {
            removeHighlight(type);
        }
    });

    const errorMessage = document.getElementById("error-message");
    if (!allValid) {
        errorMessage.textContent = "Please fill in all the required fields.";
    } else {
        errorMessage.textContent = "";
        calculateResults(); // Chama a função dinâmica
    }
}

function highlightField(field) {
    field.classList.add("highlight");
}

function removeHighlight(field) {
    field.classList.remove("highlight");
}
