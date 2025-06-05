// Tudo o que estava inline no HTML, agora organizado aqui.
document.addEventListener("DOMContentLoaded", function() {
    // Redireciona se for mobile
    if (window.innerWidth < 900) {
        window.location.replace('m.main.html');
    }

    // Função para carregar scripts dinâmicos
    window.loadScript = function(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Erro ao carregar: ' + src));
            document.body.appendChild(s);
        });
    };

    fetch('./Tables/tables-list.json')
        .then(res => res.json())
        .then(tableFiles => {
            const promises = tableFiles.map(f => {
                const base = f.replace('.json', '');
                return loadScript(`js/calculos/${base}.js`);
            });
            return Promise.all(promises);
        })
        .then(() => {
            if (typeof loadSupplierData === "function") loadSupplierData();
        })
        .catch(err => {
            document.getElementById('error-message').innerText = "Erro ao carregar scripts de cálculo: " + err;
        });

    window.resetForm = function() {
        const container = document.getElementById('dimension-container');
        container.innerHTML = '';
        container.innerHTML = `
            <div class="form-group dimension-line">
                <div>
                    <select class="type" oninput="removeHighlight(this)">
                        <option value="box">Box</option>
                        <option value="pallet">Pallet</option>
                    </select>
                </div>
                <div><input type="number" class="width" min="0" max="999" maxlength="3" oninput="validateInput(this)"></div>
                <div><input type="number" class="length" min="0" max="999" maxlength="3" oninput="validateInput(this)"></div>
                <div><input type="number" class="height" min="0" max="999" maxlength="3" oninput="validateInput(this)"></div>
                <div><input type="number" class="quantity" min="0" max="999" maxlength="3" oninput="validateInput(this)"></div>
                <div><button class="remove-button" onclick="removeLine(this)">Remove</button></div>
            </div>`;
        document.getElementById('country').value = '';
        document.getElementById('zone').value = '';
        document.getElementById('zone').disabled = true;
        document.getElementById('result').innerHTML = '';
        document.getElementById('error-message').innerHTML = '';
        document.getElementById('mensagens').innerHTML = '';
        if (typeof populateCountryDropdown === "function") populateCountryDropdown();
        if (typeof carregarMapa === "function") carregarMapa('svg/europamain.svg');
        if (typeof hideMoreBtn === "function") hideMoreBtn();
    };

    window.closeAllDropdowns = function() {
        document.getElementById('hamburgerMenu').classList.remove('show');
        document.getElementById('avatarMenu').classList.remove('show');
        document.getElementById('moreMenu').classList.remove('show');
    };

    document.getElementById('hamburgerBtn').onclick = function(e) {
        e.stopPropagation();
        const menu = document.getElementById('hamburgerMenu');
        menu.classList.toggle('show');
        document.getElementById('avatarMenu').classList.remove('show');
        document.getElementById('moreMenu').classList.remove('show');
    };
    document.getElementById('avatarBtn').onclick = function(e) {
        e.stopPropagation();
        const menu = document.getElementById('avatarMenu');
        menu.classList.toggle('show');
        document.getElementById('hamburgerMenu').classList.remove('show');
        document.getElementById('moreMenu').classList.remove('show');
    };
    document.addEventListener('click', window.closeAllDropdowns);

    window.copyToExcel = function() { alert('Função de copiar para Excel ainda não implementada.'); }
    window.printResult = function() { alert('Função de imprimir resultado ainda não implementada.'); }
    window.sendByEmail = function() { alert('Função de enviar por e-mail ainda não implementada.'); }
    window.logout = function() { alert('Logout! (implementar redirecionamento)'); }
});
