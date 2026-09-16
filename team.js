import yaruGyaru from './yaru-gyaru.js';
import kylyshSymbat from './kylyshsymbat.js';
import bayaa from './bayaa06.js';

/** @type {TeamMember[]} */
const team = [yaruGyaru, kylyshSymbat, bayaa];
const teamList = document.querySelector('#team-list');

team.forEach((member, index) => {
    const card = document.createElement('article');
    card.className = `member-card ${member.color}`;
    card.style.setProperty('--delay', `${index * 120}ms`);
    card.innerHTML = `
        <div class="card-top">
            <span class="member-number">0${index + 1}</span>
            <span class="member-initials">${member.initials}</span>
        </div>
        <div class="member-info">
            <p class="member-role">${member.role}</p>
            <h3>${member.name}</h3>
            <p class="member-about">${member.about}</p>
            <div class="skills">${member.skills.map((skill) => `<span>${skill}</span>`).join('')}</div>
        </div>
    `;
    teamList.append(card);
});