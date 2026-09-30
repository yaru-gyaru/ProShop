// Бір түске боялған ұяшықтарды санаймыз.
export function countCells(table, color) {
    return [...table.querySelectorAll('td')].filter((cell) => cell.dataset.color === color).length;
}

export function showTableTask(container) {
    container.innerHTML = `
        <button class="back-link back-button" type="button">← Артқа</button>
        <section class="task-heading">
            <p class="eyebrow">JavaScript · Table</p>
            <h1>Тапсырма 3</h1>
            <p>Кесте құру, ұяшықтарды бояу және санау.</p>
        </section>
        <form id="table-form" class="table-controls">
            <label>Жолдар саны (1–30)<input id="rows" type="number" min="1" max="30" step="1" value="4" required></label>
            <label>Бағандар саны (1–30)<input id="columns" type="number" min="1" max="30" step="1" value="5" required></label>
            <button class="task-action" type="submit">Кесте құру</button>
        </form>
        <p id="table-error" role="alert"></p>
        <label>Бояу түсі
            <select id="cell-color">
                <option value="coral">Қызғылт сары</option>
                <option value="yellow">Сары</option>
                <option value="blue">Көк</option>
            </select>
        </label>
        <p>Түсті таңдап, ұяшықты басыңыз. Сол түсті ұяшықты қайта бассаңыз, бояуы өшеді.</p>
        <div id="table-area" class="table-scroll"></div>
        <button id="count-cells" class="task-action" type="button">Ұяшықтарды санау</button>
        <div id="cell-count" class="color-counts" role="status" aria-label="Түстер бойынша ұяшықтар саны"></div>
        <section class="task-content">
            <h2>Қалай жұмыс істейді?</h2>
            <p>Ұяшықтарды бояп, «Ұяшықтарды санау» батырмасын басыңыз. Тек боялған түстердің саны көрсетіледі. Одан кейін нәтиже бояуды өзгерткен сайын автоматты жаңарады.</p>
        </section>`;

    const area = container.querySelector('#table-area');
    const colorSelect = container.querySelector('#cell-color');
    let countingStarted = false;
    function updateCount() {
        if (!countingStarted) return;
        const table = area.querySelector('table');
        // Саны нөлден үлкен түстерді ғана көрсетеміз.
        const colored = [...colorSelect.options].map((option) => ({
            color: option.value,
            name: option.textContent,
            count: countCells(table, option.value)
        })).filter((item) => item.count > 0);
        container.querySelector('#cell-count').innerHTML = colored.map((item) => `
            <span class="color-count">
                <span class="color-dot ${item.color}" aria-hidden="true"></span>
                ${item.name}: <strong>${item.count}</strong> ұяшық
            </span>
        `).join('') || 'Боялған ұяшықтар жоқ.';
    }

    function createTable(rows, columns) {
        const table = document.createElement('table');
        table.className = 'practice-table';
        const caption = table.createCaption();
        caption.textContent = `${rows} жол × ${columns} баған`;
        for (let row = 0; row < rows; row++) {
            const tr = table.insertRow();
            for (let column = 0; column < columns; column++) {
                const cell = tr.insertCell();
                cell.dataset.color = '';
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = `${row + 1}:${column + 1}`;
                button.setAttribute('aria-label', `${row + 1} жол, ${column + 1} баған`);
                button.setAttribute('aria-pressed', 'false');
                cell.append(button);
                cell.addEventListener('click', () => {
                    cell.dataset.color = cell.dataset.color === colorSelect.value ? '' : colorSelect.value;
                    button.setAttribute('aria-pressed', String(cell.dataset.color !== ''));
                    updateCount();
                });
            }
        }
        area.replaceChildren(table);
        countingStarted = false;
        container.querySelector('#cell-count').textContent = 'Нәтижені көру үшін «Ұяшықтарды санау» батырмасын басыңыз.';
    }

    container.querySelector('#table-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const rows = Number(container.querySelector('#rows').value);
        const columns = Number(container.querySelector('#columns').value);
        const valid = [rows, columns].every((n) => Number.isInteger(n) && n >= 1 && n <= 30);
        container.querySelector('#table-error').textContent = valid ? '' : '1 мен 30 арасындағы бүтін сан енгізіңіз.';
        if (valid) createTable(rows, columns);
    });
    colorSelect.addEventListener('change', updateCount);
    container.querySelector('#count-cells').addEventListener('click', () => {
        countingStarted = true;
        updateCount();
    });
    createTable(4, 5);
}

export function showThemeTask(container) {
    container.innerHTML = `
        <button class="back-link back-button" type="button">← Артқа</button>
        <section class="task-heading">
            <p class="eyebrow">JavaScript · Dark theme</p>
            <h1>Тапсырма 4</h1>
            <p>Сайттың ашық және қараңғы тақырыбын ауыстыру.</p>
        </section>
        <button id="theme-toggle" class="task-action" type="button">Қараңғы тақырып</button>
        <p id="theme-status" role="status"></p>
        <section class="task-content">
            <h2>Қалай жұмыс істейді?</h2>
            <p>Батырма body элементіндегі dark-theme класын қосады немесе алып тастайды. CSS түстерді өзгертеді. Таңдалған тақырып резюме мен басқа тапсырмаларға өткенде де сақталады.</p>
        </section>`;
    const toggle = container.querySelector('#theme-toggle');
    function updateStatus() {
        const dark = document.body.classList.contains('dark-theme');
        toggle.setAttribute('aria-pressed', String(dark));
        container.querySelector('#theme-status').textContent = dark ? 'Қазір қараңғы тақырып қосулы.' : 'Қазір ашық тақырып қосулы.';
    }
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        updateStatus();
    });
    updateStatus();
}
