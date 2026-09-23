import yaruGyaru from './yaru-gyaru.js';
import kylyshSymbat from './kylyshsymbat.js';
import bayaa from './bayaa06.js';

const team = [yaruGyaru, kylyshSymbat, bayaa];
const resume = document.querySelector('#resume');
const memberSlug = new URLSearchParams(window.location.search).get('member');
const member = team.find((person) => person.slug === memberSlug);

if (!member) {
    resume.innerHTML = `
        <a class="back-link" href="./index.html">← Вернуться к команде</a>
        <h1>Участник не найден</h1>
        <p>Проверьте ссылку и попробуйте снова.</p>
    `;
} else {
    document.title = `${member.name} — резюме | ProShop`;
    const photo = member.photo
        ? `<img class="resume-photo" src="${member.photo}" alt="Фото ${member.name}">`
        : `<div class="resume-photo resume-photo-placeholder"><span>Ваше<br>фото</span><small>Добавьте файл<br>в поле photo</small></div>`;

    const list = (items) => items.map((item) => `<li>${item}</li>`).join('');
    const pairs = (items) => items.map(([title, text]) => `
        <div class="resume-detail"><strong>${title}</strong><p>${text}</p></div>
    `).join('');

    resume.innerHTML = `
        <a class="back-link" href="./index.html#team">← Все участники</a>
        <section class="resume-heading ${member.color}">
            <div class="resume-heading-text">
                <p class="resume-role">${member.role}</p>
                <h1>${member.name}</h1>
                <ul class="resume-contact">${list(member.resume.contact)}</ul>
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
}
