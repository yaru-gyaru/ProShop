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
    resumeView.querySelector('.back-button').addEventListener('click', showTeam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showTeam() {
    hero.hidden = false;
    resumeView.hidden = true;
    teamSection.hidden = false;
    window.scrollTo({ top: teamSection.offsetTop, behavior: 'smooth' });
}

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
