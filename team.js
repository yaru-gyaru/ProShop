import yaruGyaru from './yaru-gyaru.js';
import kylyshSymbat from './kylyshsymbat.js';
import bayaa from './bayaa06.js';

const team = [yaruGyaru, kylyshSymbat, bayaa];
const hero = document.querySelector('.hero');
const teamSection = document.querySelector('#team');
const teamList = document.querySelector('#team-list');
const resumeView = document.querySelector('#resume-view');

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
    <div class="task-box">
      <h2>1-тапсырма</h2>
      <p id="hello-text">Ескі мәтін</p>
      <div class="old-element">Ескі элемент (жойылатын)</div>
      <button id="run-task1" class="task-btn">Тапсырманы орындау</button>
      <div id="task1-result"></div>
    </div>
  `;

  document.getElementById('run-task1').onclick = () => {
    // 1. ID бойынша мәтінді өзгерту
    const hello = document.getElementById('hello-text');
    if (hello) hello.textContent = 'Сәлем, әлем!';

    // 2. Жаңа div жасау және body соңына қосу
    if (!document.querySelector('.new-div')) {
      const newDiv = document.createElement('div');
      newDiv.className = 'new-div';
      newDiv.textContent = 'Мен жаңа элементпін';
      document.body.appendChild(newDiv);
    }

    // 3. old-element-ті жою
    document.querySelector('.old-element')?.remove();

    // 4 + 5. Абзац жасау
    if (!document.querySelector('#task1-result p')) {
      const p = document.createElement('p');
      p.textContent = 'Бұл ауыспалы абзац';
      p.style.cssText = 'cursor:pointer; padding:12px; background:#fff3cd; border-radius:8px; margin-top:12px; transition:0.2s;';

      let changed = false;
      p.onclick = () => {
        if (!changed) {
          p.style.color = '#e65100';
          p.style.fontSize = '1.3rem';
          p.style.fontWeight = '600';
          changed = true;
        } else {
          p.style.color = '';
          p.style.fontSize = '';
          p.style.fontWeight = '';
          changed = false;
        }
      };

      document.getElementById('task1-result').appendChild(p);
    }
  };
}

// ===== 2-ТАПСЫРМА =====
function showTask2() {
  teamList.innerHTML = `
    <div class="task-box">
      <h2>2-тапсырма</h2>
      <div id="toggle-box" class="toggle-element">Мені басыңыз (active класы қосылады / алынады)</div>
      <button id="run-task2" class="task-btn">Класты ауыстыру</button>
      <p id="class-list">Кластар тізімі осында шығады</p>
    </div>
  `;

  document.getElementById('run-task2').onclick = () => {
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

// Бастапқыда карточкаларды көрсету
showTeamCards();