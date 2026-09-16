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
    resume.innerHTML = `
        <a class="back-link" href="./index.html#team">← Все участники</a>
        <section class="resume-heading ${member.color}">
            <div>
                <p class="resume-role">${member.role}</p>
                <h1>${member.name}</h1>
            </div>
            <div class="resume-avatar">${member.initials}</div>
        </section>
        <section class="resume-grid">
            <div class="resume-block">
                <h2>О себе</h2>
                <p>${member.resume.summary}</p>
            </div>
            <div class="resume-block">
                <h2>Навыки</h2>
                <div class="resume-skills">${member.skills.map((skill) => `<span>${skill}</span>`).join('')}</div>
            </div>
            <div class="resume-block">
                <h2>Опыт</h2>
                <p>${member.resume.experience}</p>
            </div>
            <div class="resume-block">
                <h2>Обучение</h2>
                <p>${member.resume.education}</p>
            </div>
        </section>
    `;
}
