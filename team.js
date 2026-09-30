import yaruGyaru from './yaru-gyaru.js';
import kylyshSymbat from './kylyshsymbat.js';
import bayaa from './bayaa06.js';

const team = [yaruGyaru, kylyshSymbat, bayaa];
const hero = document.querySelector('.hero');
const teamSection = document.querySelector('#team');
const teamList = document.querySelector('#team-list');
const resumeView = document.querySelector('#resume-view');
<<<<<<< HEAD
=======
const memberTabs = document.querySelector('#member-tabs');
const tasksView = document.querySelector('#tasks-view');
const taskTabs = document.querySelectorAll('.task-tab');
>>>>>>> 28ea773af115a46d96cad9ea9587728833bf13c3

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
        <a class="github-link github-button resume-github" href="https://github.com/${member.github}" target="_blank" rel="noreferrer">Открыть GitHub ↗️</a>
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
  resumeView.querySelector('.back-button').addEventListener('click', showTeam);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showTeam() {
  hero.hidden = false;
  resumeView.hidden = true;
  teamSection.hidden = false;
  window.scrollTo({ top: teamSection.offsetTop, behavior: 'smooth' });
}

// ===== ВКЛАДКАЛАР =====
const tabs = document.querySelectorAll('.member-tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const name = tab.dataset.tab;

    if (name === 'team') {
      showTeamCards();
    } else if (name === 'task1') {
      showTask1();
    } else if (name === 'task2') {
      showTask2();
    } else if (name === 'ayaru') {
      showResume(team[0]);
    } else if (name === 'symbat') {
      showResume(team[1]);
    } else if (name === 'bayansulu') {
      showResume(team[2]);
    }
  });
});

// ===== КАРТОЧКАЛАР =====
function showTeamCards() {
  teamList.innerHTML = '';
  team.forEach((member, index) => {
    const card = document.createElement('article');
    card.className = `member-card ${member.color}`;
    card.style.setProperty('--delay', `${index * 120}ms`);

    card.innerHTML = `
      <div class="card-top">
        <span class="member-number">0${index + 1}</span>
        <a class="github-link github-button" href="https://github.com/${member.github}" target="_blank" rel="noreferrer">GitHub ↗️</a>
        <span class="member-initials">${member.initials}</span>
      </div>
      <div class="member-info">
        <p class="member-role">${member.role}</p>
        <h3>${member.name}</h3>
        <p class="member-about">${member.about}</p>
        <div class="skills">
          ${member.skills.map(skill => `<span>${skill}</span>`).join('')}
        </div>
      </div>
    `;

    card.querySelector('.github-link').addEventListener('click', e => e.stopPropagation());
    card.addEventListener('click', () => showResume(member));
    teamList.append(card);
  });
}

// ===== 1-ТАПСЫРМА =====
function showTask1() {
  teamList.innerHTML = `
    <div class="task-box full-width">
      <h2>1-ТАПСЫРМА</h2>
      <p class="task-subtitle">DOM элементтерімен жұмыс · Мәтінді өзгерту, элемент қосу және жою</p>

      <div class="task-block">
        <h3>ID бойынша мәтінді өзгерту</h3>
        <p id="hello-text">Бастапқы мәтін</p>
        <button id="btn-change-text" class="task-btn">Мәтінді өзгерту</button>
      </div>

      <div class="task-block">
        <h3>Абзац стилін өзгерту</h3>
        <p class="small">Батырманы басқанда мәтіннің түсі мен қаріп өлшемі өзгереді.</p>
        <p id="style-paragraph" class="style-p">Бұл ауыспалы абзац</p>
        <button id="btn-change-style" class="task-btn">Стильді өзгерту</button>
      </div>

      <div class="task-block">
        <h3>Жаңа элемент қосу</h3>
        <p class="small">Жаңа div body тегінің соңына қосылады.</p>
        <button id="btn-add-div" class="task-btn">Жаңа div қосу</button>
        <div id="new-div-preview"></div>
      </div>

      <div class="task-block">
        <h3>Элементті жою</h3>
        <p class="small">Бұл ескі элемент жойылады.</p>
        <div class="old-element" id="old-element">Ескі элемент</div>
        <button id="btn-remove" class="task-btn">Ескі элементті жою</button>
      </div>
    </div>
  `;

  // 1. Мәтінді өзгерту
  document.getElementById('btn-change-text').onclick = () => {
    document.getElementById('hello-text').textContent = 'Сәлем, әлем!';
  };

  // 2. Стильді өзгерту
  let styleChanged = false;
  document.getElementById('btn-change-style').onclick = () => {
    const p = document.getElementById('style-paragraph');
    if (!styleChanged) {
      p.style.color = '#e65100';
      p.style.fontSize = '1.35rem';
      p.style.fontWeight = '600';
      styleChanged = true;
    } else {
      p.style.color = '';
      p.style.fontSize = '';
      p.style.fontWeight = '';
      styleChanged = false;
    }
  };

  // 3. Жаңа div → body соңына
  document.getElementById('btn-add-div').onclick = () => {
    const btn = document.getElementById('btn-add-div');
    const preview = document.getElementById('new-div-preview');

    if (!document.querySelector('.new-div')) {
      const newDiv = document.createElement('div');
      newDiv.className = 'new-div';
      newDiv.textContent = 'Мен жаңа элементпін';
      
      document.body.appendChild(newDiv);   // ← body соңына қосылады

      btn.textContent = 'Жаңа div қосылды ✓';
      btn.disabled = true;
      btn.style.opacity = '0.75';

      preview.innerHTML = `<div class="new-div-preview">Мен жаңа элементпін</div>`;
    }
  };

  // 4. Ескі элементті жою
  document.getElementById('btn-remove').onclick = () => {
    const el = document.getElementById('old-element');
    if (el) {
      el.remove();
      const btn = document.getElementById('btn-remove');
      btn.textContent = 'Элемент жойылды ✓';
      btn.disabled = true;
      btn.style.opacity = '0.75';
    }
  };
}
// ===== 2-ТАПСЫРМА =====
function showTask2() {
  teamList.innerHTML = `
    <div class="task-box full-width">
      <h2>2-ТАПСЫРМА</h2>
      <p class="task-subtitle">Элемент кластарын басқару · active класын қосу / алу</p>

      <div class="task-block">
        <div id="toggle-box" class="toggle-element dom-demo class-example">
          Классы өзгеретін элемент
        </div>
        <button id="btn-toggle-class" class="task-btn">active қосу / алу</button>
        <p id="class-list">Кластар тізімі: —</p>
        <p class="hint">Кластар тізімі браузер консольде де көрсетіледі (F12 → Console).</p>
      </div>
    </div>
  `;

  document.getElementById('btn-toggle-class').onclick = () => {
    const box = document.getElementById('toggle-box');
    if (!box) return;

    box.classList.toggle('active');

    console.log('Элемент кластары:', box.classList);

    const listP = document.getElementById('class-list');
    if (listP) {
      listP.textContent = 'Кластар тізімі: ' + Array.from(box.classList).join(', ');
    }
  };
}
