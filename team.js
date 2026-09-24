import yaruGyaru from './yaru-gyaru.js';
import kylyshSymbat from './kylyshsymbat.js';
import bayaa from './bayaa06.js';

const team = [yaruGyaru, kylyshSymbat, bayaa];
const hero = document.querySelector('.hero');
const teamSection = document.querySelector('#team');
const teamList = document.querySelector('#team-list');
const resumeView = document.querySelector('#resume-view');
const memberTabs = document.querySelector('#member-tabs');
const tasksView = document.querySelector('#tasks-view');
const taskTabs = document.querySelectorAll('.task-tab');

const list = (items) => items.map((item) => `<li>${item}</li>`).join('');
const pairs = (items) => items.map(([title, text]) => `
    <div class="resume-detail"><strong>${title}</strong><p>${text}</p></div>
`).join('');

function showResume(member) {
    const photo = member.photo
        ? `<img class="resume-photo" src="${member.photo}" alt="Фото ${member.name}">`
        : `<div class="resume-photo resume-photo-placeholder"><span>Ваше<br>фото</span><small>Добавьте файл<br>в поле photo</small></div>`;

    resumeView.innerHTML = `
        <button class="back-link back-button" type="button">← Назад к команде</button>
        <section class="resume-heading ${member.color}">
            <div class="resume-heading-text">
                <p class="resume-role">${member.role}</p>
                <h1>${member.name}</h1>
                <ul class="resume-contact">${list(member.resume.contact)}</ul>
                <a class="github-link github-button resume-github" href="https://github.com/${member.github}" target="_blank" rel="noreferrer">Открыть GitHub ↗</a>
            </div>
            ${photo}
        </section>
        <section class="resume-grid">
            <div class="resume-block">
                <h2>О себе</h2>
                <p>${member.resume.summary}</p>
            </div>
            <div class="resume-block">
                <h2>Образование</h2>
                <ul class="resume-list">${list(member.resume.education)}</ul>
            </div>
            <div class="resume-block resume-block-wide">
                <h2>Технические навыки</h2>
                <div class="resume-details">${pairs(member.resume.technicalSkills)}</div>
            </div>
            <div class="resume-block resume-block-wide">
                <h2>Проекты и мероприятия</h2>
                <div class="resume-details">${pairs(member.resume.projects)}</div>
            </div>
            <div class="resume-block">
                <h2>Soft skills</h2>
                <ul class="resume-list">${list(member.resume.softSkills)}</ul>
            </div>
            <div class="resume-block">
                <h2>Языки</h2>
                <ul class="resume-list">${list(member.resume.languages)}</ul>
            </div>
        </section>
    `;

    hero.hidden = true;
    teamSection.hidden = true;
    resumeView.hidden = false;
    tasksView.hidden = true;
    resumeView.querySelector('.back-button').addEventListener('click', showTeam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showTeam() {
    document.querySelectorAll('.new-div').forEach((element) => element.remove());
    hero.hidden = false;
    resumeView.hidden = true;
    tasksView.hidden = true;
    teamSection.hidden = false;
    window.scrollTo({ top: teamSection.offsetTop, behavior: 'smooth' });
}

function runTask1() {
    document.querySelectorAll('.new-div').forEach((element) => element.remove());
    const textElement = document.querySelector('#task-text');
    textElement.textContent = 'Сәлем, әлем!';

    const newDiv = document.createElement('div');
    newDiv.className = 'new-div';
    newDiv.textContent = 'Мен жаңа элементпін';
    document.body.append(newDiv);

    const oldElement = document.querySelector('.old-element');
    if (oldElement) oldElement.remove();

    const paragraph = document.createElement('p');
    paragraph.className = 'click-paragraph';
    paragraph.textContent = 'Бұл ауыспалы абзац';
    paragraph.addEventListener('click', () => {
        paragraph.style.color = '#e7614e';
        paragraph.style.fontSize = '1.25rem';
    });
    document.querySelector('#task-playground').append(paragraph);
}

function runTask2() {
    const classElement = document.querySelector('#class-element');
    const classOutput = document.querySelector('#class-output');
    classElement.classList.toggle('active');
    const classes = [...classElement.classList].join(', ');
    console.log('Барлық кластар:', classes);
    classOutput.textContent = `Кластар тізімі: ${classes}`;
}

function showTask(taskName) {
    hero.hidden = true;
    teamSection.hidden = true;
    resumeView.hidden = true;
    tasksView.hidden = false;

    if (taskName === 'task-1') {
        tasksView.innerHTML = `
            <button class="back-link back-button" type="button">← Артқа</button>
            <section class="task-heading coral">
                <p class="eyebrow">JavaScript · DOM</p>
                <h1>Тапсырма 1</h1>
                <p>Элементтерді табу, жасау, жою және оларға оқиға қосу.</p>
            </section>
            <section class="task-content">
                <h2>Жұмыс нәтижесі</h2>
                <div id="task-playground" class="task-playground">
                    <p id="task-text">Бастапқы мәтін</p>
                    <div class="old-element">Бұл ескі элемент кейін жойылады</div>
                </div>
                <p class="task-hint">Төмендегі абзацты басып көріңіз: түсі мен өлшемі өзгереді.</p>
                <h2>Не жасалды?</h2>
                <ol class="task-explanation">
                    <li>ID арқылы элемент табылып, оның мәтіні «Сәлем, әлем!» болып өзгертілді.</li>
                    <li><code>new-div</code> класы бар жаңа <code>div</code> құрылып, <code>body</code> соңына қосылды.</li>
                    <li><code>old-element</code> класы бар ескі элемент жойылды.</li>
                    <li>Абзац жасалып, оны басқанда түсі мен қаріп өлшемі өзгеретін болды.</li>
                </ol>
            </section>
        `;
        runTask1();
    } else {
        tasksView.innerHTML = `
            <button class="back-link back-button" type="button">← Артқа</button>
            <section class="task-heading yellow">
                <p class="eyebrow">JavaScript · classList</p>
                <h1>Тапсырма 2</h1>
                <p>Элемент кластарын басқару және олардың тізімін көрсету.</p>
            </section>
            <section class="task-content">
                <h2>Жұмыс нәтижесі</h2>
                <div id="class-element" class="class-demo">Белсенді класты көру үшін батырманы басыңыз</div>
                <button id="toggle-class" class="task-action" type="button">active класын ауыстыру</button>
                <p id="class-output" class="class-output">Кластар тізімі: class-demo</p>
                <h2>Не жасалды?</h2>
                <ol class="task-explanation">
                    <li><code>classList.toggle('active')</code> класты қосады немесе алып тастайды.</li>
                    <li>Барлық кластар <code>classList</code> арқылы массивке жиналды.</li>
                    <li>Кластар тізімі консольге және төмендегі <code>p</code> тегіне шығарылды.</li>
                </ol>
            </section>
        `;
        document.querySelector('#toggle-class').addEventListener('click', runTask2);
        runTask2();
    }

    tasksView.querySelector('.back-button').addEventListener('click', showTeam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

team.forEach((member) => {
    const tab = document.createElement('button');
    tab.className = 'member-tab';
    tab.type = 'button';
    tab.textContent = member.name;
    tab.addEventListener('click', () => showResume(member));
    memberTabs.append(tab);
});

taskTabs.forEach((tab) => {
    tab.addEventListener('click', () => showTask(tab.dataset.task));
});

team.forEach((member, index) => {
    const card = document.createElement('article');
    card.className = `member-card ${member.color}`;
    card.style.setProperty('--delay', `${index * 120}ms`);
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Открыть резюме: ${member.name}`);
    card.innerHTML = `
        <div class="card-top">
            <span class="member-number">0${index + 1}</span>
            <a class="github-link github-button" href="https://github.com/${member.github}" target="_blank" rel="noreferrer">GitHub ↗</a>
            <span class="member-initials">${member.initials}</span>
        </div>
        <div class="member-info">
            <p class="member-role">${member.role}</p>
            <h3>${member.name}</h3>
            <p class="member-about">${member.about}</p>
            <div class="skills">${member.skills.map((skill) => `<span>${skill}</span>`).join('')}</div>
        </div>
    `;
    card.querySelector('.github-link').addEventListener('click', (event) => event.stopPropagation());
    card.addEventListener('click', () => showResume(member));
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            showResume(member);
        }
    });
    teamList.append(card);
});
