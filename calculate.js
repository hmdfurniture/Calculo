// Function to populate the "Select Country" dropdown
function populateCountryDropdown(countries) {
  const countryList = document.getElementById("country-list");
  countryList.innerHTML = ""; // Clear previous options

  // Sort and ensure uniqueness of countries
  const uniqueCountries = [...new Set(countries)].sort();

  // Populate the dropdown list
  uniqueCountries.forEach((country) => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = country;
    a.onclick = () => {
      selectCountry(country);
      hideDropdown("country-list"); // Hide the dropdown after selection
    };
    countryList.appendChild(a);
  });
}

// Function to handle country selection
function selectCountry(country) {
  const countryInput = document.getElementById("country");
  countryInput.value = country;

  // Trigger input event to populate zones
  countryInput.dispatchEvent(new Event("input"));
}

// Function to show the dropdown
function showDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.style.display = "block";
}

// Function to hide the dropdown
function hideDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.style.display = "none";
}

// Function to filter countries as user types
function filterCountries() {
  const input = document.getElementById("country");
  const filter = input.value.toLowerCase();
  const countryList = document.getElementById("country-list");
  const items = countryList.getElementsByTagName("a");

  for (let i = 0; i < items.length; i++) {
    const text = items[i].textContent || items[i].innerText;
    if (text.toLowerCase().indexOf(filter) > -1) {
      items[i].style.display = ""; // Show matching items
    } else {
      items[i].style.display = "none"; // Hide non-matching items
    }
  }
}

// Function to add a new line dynamically
function addLine() {
  const container = document.getElementById("dimension-container");

  // Create a new row
  const newLine = document.createElement("div");
  newLine.className = "form-group dimension-line";

  newLine.innerHTML = `
      <div>
          <input type="number" class="width" min="0" max="999" oninput="validateInput(this)">
      </div>
      <div>
          <input type="number" class="length" min="0" max="999" oninput="validateInput(this)">
      </div>
      <div>
          <input type="number" class="height" min="0" max="999" oninput="validateInput(this)">
      </div>
      <div>
          <input type="number" class="quantity" min="0" max="999" oninput="validateInput(this)">
      </div>
      <div>
          <select class="type" oninput="removeHighlight(this)">
              <option value="box">Box</option>
              <option value="pallet">Pallet</option>
          </select>
      </div>
      <div>
          <input type="text" class="cubic-capacity" readonly>
      </div>
      <div>
          <button class="remove-button" onclick="removeLine(this)">Remove</button>
      </div>
  `;

  // Append the new line to the container
  container.appendChild(newLine);
}

// Function to remove a specific line
function removeLine(button) {
  const line = button.parentElement.parentElement; // Get the parent row
  line.remove(); // Remove the row
}

// Add event listeners for inputs
document.getElementById("country").addEventListener("focus", () => {
  showDropdown("country-list"); // Show dropdown when input is focused
});

document.getElementById("country").addEventListener("blur", () => {
  setTimeout(() => hideDropdown("country-list"), 200); // Hide dropdown after 200ms to allow clicks
});
