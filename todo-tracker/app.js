const API = 'https://dummyjson.com';
const userForm = document.querySelector('#user-form');
const todoForm = document.querySelector('#todo-form');
const textInput = document.querySelector('#todo-text');
const addDialog = document.querySelector('#add-dialog');
const assigneeSelect = document.querySelector('#assignee');
const statusSelect = document.querySelector('#new-status');
const list = document.querySelector('#todos');
const message = document.querySelector('#message');
let userId = null;
let loadedOwners = [];
let todos = [];
let userProfiles = new Map();
let profileLoadNumber = 0;
let editingKey = null;
let busy = false;
const dialog = document.querySelector('#edit-dialog');
const profileDialog = document.querySelector('#profile-dialog');
let openProfileId = null;
let profilesLoading = false;
const editInput = document.querySelector('#edit-text');

function tell(text, error = false) {
    message.textContent = text;
    message.classList.toggle('error', error);
}

// Все реальные запросы собраны в одной функции.
async function request(path, method = 'GET', body) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
        const response = await fetch(API + path, {
            method,
            headers: body ? { 'Content-Type': 'application/json' } : {},
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal
        });
        if (!response.ok) throw new Error(`API қатесі ${response.status}`);
        return await response.json();
    } finally {
        clearTimeout(timer);
    }
}

// Пайдаланушылардың тек тапсырмаларда қажет деректерін аламыз.

async function loadUserProfiles() {
    if (profilesLoading) return;
    profilesLoading = true;
    const thisLoad = ++profileLoadNumber;
    try {
        const data = await request('/users?limit=0&select=id,username,image,firstName,lastName,age,email,phone,gender,birthDate,address,university,company');
        if (!Array.isArray(data.users) || thisLoad !== profileLoadNumber) return;
        userProfiles = new Map(data.users.map((profile) => [profile.id, profile]));
        fillAssigneeOptions();
        render();
        if (profileDialog.open) {
            renderProfile(openProfileId);
        }
    } catch {
        // Пайдаланушы деректері уақытша ашылмаса да, тапсырмалар көрсетіле береді.
    } finally {
        profilesLoading = false;
    }
}

function fillAssigneeOptions() {
    if (!assigneeSelect || userId === null) return;

    const selectedId = userId === 0 ? Number(assigneeSelect.value) : userId;
    const availableIds = userId === 0
        ? [...new Set([...userProfiles.keys(), ...loadedOwners])].sort((a, b) => a - b)
        : [userId];

    assigneeSelect.replaceChildren();
    availableIds.forEach((id) => {
        const profile = userProfiles.get(id);
        const option = document.createElement('option');
        option.value = String(id);
        option.textContent = profile?.username
            ? `@${profile.username} · #${id}`
            : `Пайдаланушы #${id}`;
        assigneeSelect.append(option);
    });

    if (availableIds.includes(selectedId)) {
        assigneeSelect.value = String(selectedId);
    }
}

// На время запроса блокируем действия, чтобы пользователи и ответы не смешались.
async function action(work) {
    if (busy) return;
    busy = true;
    document.querySelectorAll('button, input, select, textarea').forEach((el) => el.disabled = true);
    tell('Жүктелуде…');
    try { await work(); }
    catch (error) { tell('Әрекет орындалмады. Интернет байланысын тексеріп, қайталап көріңіз.', true); }
    finally {
        busy = false;
        document.querySelectorAll('button, input, select, textarea').forEach((el) => el.disabled = false);
    }
}

function storageKey(id) { return `task-desk:v1:user:${id}`; }
function save() {
    try {
        const owners = userId === 0 ? loadedOwners : [userId];
        owners.forEach((id) => localStorage.setItem(storageKey(id), JSON.stringify(todos.filter((todo) => todo.userId === id))));
        tell('Өзгерістер осы браузерде сақталды.');
    } catch {
        tell('Өзгеріс орындалды, бірақ браузерде сақталмады. Бетті жаңартқанда жоғалады.', true);
    }
}

function cancelEdit() {
    editingKey = null;
    dialog.close();
}

function startEditing(todo) {
    editingKey = todo.key;
    editInput.value = todo.todo;
    document.querySelector('#edit-owner').textContent =
        `Тапсырма иесі: пайдаланушы #${todo.userId}`;
    document.querySelector('#edit-error').textContent = '';
    dialog.showModal();
}

function removeTodo(todo) {
    if (!confirm(`«${todo.todo}» тапсырмасын жою керек пе?`)) return;

    action(async () => {
        if (!todo.local) {
            await request(`/todos/${todo.id}`, 'DELETE');
        }

        todos = todos.filter((item) => item.key !== todo.key);
        if (editingKey === todo.key) cancelEdit();
        save();
        render();

        if (profileDialog.open) {
            renderProfile(openProfileId);
        }
    });
}

function fillProfileTasks(listId, emptyId, tasks) {
    const taskList = document.querySelector(`#${listId}`);
    taskList.replaceChildren();
    document.querySelector(`#${emptyId}`).hidden = tasks.length > 0;

    tasks.forEach((todo) => {
        const item = document.createElement('li');
        item.className = 'profile-task';

        const text = document.createElement('span');
        text.className = 'profile-task-text';
        text.textContent = todo.todo;

        const buttons = document.createElement('div');
        buttons.className = 'profile-task-actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'secondary';
        editButton.textContent = 'Өзгерту';
        editButton.addEventListener('click', () => startEditing(todo));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'secondary';
        deleteButton.textContent = 'Жою';
        deleteButton.addEventListener('click', () => removeTodo(todo));

        buttons.append(editButton, deleteButton);
        item.append(text, buttons);
        taskList.append(item);
    });
}

function renderProfile(id) {
    if (id === null) return;

    const profile = userProfiles.get(id);
    const avatar = document.querySelector('#profile-avatar');
    const fullName = profile
        ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
        : '';

    document.querySelector('#profile-title').textContent =
        profile?.username ? `@${profile.username}` : `Пайдаланушы #${id}`;

    document.querySelector('#profile-info').textContent = `${fullName || 'Пайдаланушы'} · ID #${id}`;


    document.querySelector('#profile-link').href = `${API}/users/${id}` + (profile?.username ? `?username=${profile.username}` : '')        ;
    document.querySelector('#profile-link').href = `${API}/users/${id}`;
    const address = profile?.address
        ? [profile.address.address, profile.address.city, profile.address.state, profile.address.postalCode, profile.address.country]
            .filter(Boolean).join(', ')
        : '';
    const genderNames = { female: 'Әйел', male: 'Ер' };
    const details = [
        ['Пайдаланушы аты', profile?.username ? `@${profile.username}` : ''],
        ['Жасы', profile?.age ? `${profile.age} жас` : ''],
        ['Жынысы', genderNames[profile?.gender] || profile?.gender || ''],
        ['Туған күні', profile?.birthDate || ''],
        ['Электрондық пошта', profile?.email || ''],
        ['Телефон', profile?.phone || ''],
        ['Мекенжайы', address],
        ['Оқу орны', profile?.university || ''],
        ['Жұмыс орны', profile?.company?.name || ''],
        ['Қызметі', profile?.company?.title || '']
    ];
    const detailsList = document.querySelector('#profile-details');
    detailsList.replaceChildren();
    details.filter(([, value]) => value).forEach(([label, value]) => {
        const item = document.createElement('li');
        const name = document.createElement('span');
        name.className = 'profile-detail-name';
        name.textContent = label;
        const content = document.createElement('span');
        content.className = 'profile-detail-value';
        content.textContent = value;
        item.append(name, content);
        detailsList.append(item);
    });

    if (profile?.image) {
        avatar.src = profile.image;
        avatar.hidden = false;
    } else {
        avatar.removeAttribute('src');
        avatar.hidden = true;
    }

    const userTasks = todos.filter((todo) => todo.userId === id);
    fillProfileTasks(
        'profile-done',
        'profile-done-empty',
        userTasks.filter((todo) => todo.completed)
    );
    fillProfileTasks(
        'profile-open',
        'profile-open-empty',
        userTasks.filter((todo) => !todo.completed)
    );
}

function showProfile(id) {
    openProfileId = id;
    renderProfile(id);

    if (!profileDialog.open) {
        profileDialog.showModal();
    }

    if (!userProfiles.has(id) && !profilesLoading) {
        void loadUserProfiles();
    }
}

document.querySelector('#close-profile').addEventListener('click', () => {
    profileDialog.close();
});

profileDialog.addEventListener('close', () => {
    openProfileId = null;
});

function render() {
    list.replaceChildren();
    const done = todos.filter((todo) => todo.completed).length;
    document.querySelector('#owner').textContent = userId === 0 ? 'Барлық пайдаланушылардың тапсырмалары' : `Пайдаланушы #${userId}`;
    document.querySelector('#stats').textContent = `${todos.length} тапсырманың ${done} орындалды`;
    const progress = document.querySelector('#progress');
    progress.max = todos.length || 1;
    progress.value = done;
    const filter = document.querySelector('#filter').value;
    const visible = todos.filter((todo) => filter === 'all' || todo.completed === (filter === 'done'));
    const sort = document.querySelector('#sort').value;

    if (sort === 'az') {
    visible.sort((a, b) =>
        a.todo.localeCompare(b.todo, 'kk', { sensitivity: 'base' })
    );
} else if (sort === 'za') {
    visible.sort((a, b) =>
        b.todo.localeCompare(a.todo, 'kk', { sensitivity: 'base' })
    );
} else if (sort === 'user') {
    visible.sort((a, b) => a.userId - b.userId);
} else if (sort === 'open') {
    visible.sort((a, b) => Number(a.completed) - Number(b.completed));
} else if (sort === 'done') {
    visible.sort((a, b) => Number(b.completed) - Number(a.completed));
}
    document.querySelector('#empty').hidden = visible.length > 0;
    document.querySelector('#empty').textContent = todos.length ? 'Таңдалған күйдегі тапсырмалар жоқ.' : 'Тапсырмалар жоқ. Алғашқы тапсырманы қосыңыз!';
    visible.forEach((todo) => {
        const row = document.createElement('li');
        row.className = `todo ${todo.completed ? 'done' : ''}`;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.setAttribute('aria-label', `Орындалды: ${todo.todo}`);
        checkbox.addEventListener('change', () => {
            const completed = checkbox.checked;
            checkbox.checked = todo.completed;
            action(async () => {
                if (!todo.local) await request(`/todos/${todo.id}`, 'PATCH', { completed });
                todo.completed = completed;
                save(); render();
                if (profileDialog.open) renderProfile(openProfileId);
            });
        });
        const content = document.createElement('div');
        content.className = 'todo-content';
        const title = document.createElement('span');
        title.className = 'todo-text';
        title.textContent = todo.todo; // Текст API и пользователя не вставляем как HTML.
        const meta = document.createElement('span');
        meta.className = 'meta';
        meta.textContent = `${todo.completed ? 'оқылды' : 'оқылды емес'} · #${todo.userId} · ${todo.local ? 'Жергілікті' : `API #${todo.id}`}`;
        const profile = userProfiles.get(todo.userId);
        const account = document.createElement('a');
        account.className = 'task-user';
        account.href = `${API}/users/${todo.userId}`;
        account.target = '_blank';
        account.rel = 'noopener noreferrer';
        account.addEventListener('click', (event) => {
            event.preventDefault();
            showProfile(todo.userId);
        });
        account.setAttribute('aria-label', `Тапсырма иесінің профилін ашу: ${profile?.username || `#${todo.userId}`}`);

        const avatar = document.createElement('img');
        avatar.className = 'task-user-avatar';
        avatar.src = profile?.image || `${API}/icon/user-${todo.userId}/64`;
        avatar.alt = '';
        avatar.width = 28;
        avatar.height = 28;
        avatar.loading = 'lazy';

        const username = document.createElement('span');
        username.textContent = profile?.username ? `@${profile.username}` : `Пайдаланушы #${todo.userId}`;
        account.append(avatar, username);
        content.append(title, meta, account);
        const actions = document.createElement('div');
        actions.className = 'actions';
        const edit = document.createElement('button');
        edit.className = 'secondary';
        edit.textContent = 'Өзгерту';
        edit.addEventListener('click', () => {
            editingKey = todo.key;
            editInput.value = todo.todo;
            document.querySelector('#edit-owner').textContent =
                 `Тапсырма иесі: пайдаланушы #${todo.userId}`;
            document.querySelector('#edit-error').textContent = '';
            dialog.showModal();
        });
        edit.addEventListener('click', () => startEditing(todo));
        const remove = document.createElement('button');
        remove.className = 'secondary';
        remove.textContent = 'Жою';
        remove.addEventListener('click', () => removeTodo(todo));
        actions.append(edit, remove);
        row.append(checkbox, content, actions);
        list.append(row);
    });
}

userForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = Number(document.querySelector('#user-id').value);
    if (!Number.isSafeInteger(id) || id < 0) return tell('Нөл немесе оң бүтін ID енгізіңіз.', true);
    action(async () => {
        const data = await request(id === 0 ? '/todos?limit=0' : `/todos/user/${id}?limit=0`);
        if (!Array.isArray(data.todos)) throw new Error('API жауабы дұрыс емес');
        let next = data.todos.filter((todo) => (id === 0 || todo.userId === id)).map((todo) => ({ ...todo, key: `api-${todo.id}`, local: false }));
        let cached = false;
        loadedOwners = id === 0 ? [...new Set(next.map((todo) => todo.userId))] : [id];
        try {
            if (id === 0) {
                for (let i = 0; i < localStorage.length; i++) {
                    const match = localStorage.key(i).match(/^task-desk:v1:user:(\d+)$/);
                    if (match && Number(match[1]) > 0) loadedOwners.push(Number(match[1]));
                }
                loadedOwners = [...new Set(loadedOwners)];
            }
            for (const owner of loadedOwners) {
                const stored = JSON.parse(localStorage.getItem(storageKey(owner)));
                if (Array.isArray(stored) && stored.every((todo) => todo.userId === owner && typeof todo.key === 'string' && typeof todo.todo === 'string' && typeof todo.completed === 'boolean' && Number.isInteger(todo.id) && typeof todo.local === 'boolean')) {
                    next = next.filter((todo) => todo.userId !== owner).concat(stored);
                    cached = true;
                }
            }
        } catch { /* Сақтау қолжетімсіз болса, API деректері көрсетіледі. */ }
        userId = id;
        todos = next;
        cancelEdit();
        document.querySelector('#filter').value = 'all';
        document.querySelector('#workspace').hidden = false;
        fillAssigneeOptions();
        render();
        tell(cached ? 'API жүктелді. Сақталған өзгерістер көрсетілді.' : 'Тапсырмалар API арқылы жүктелді.');
        void loadUserProfiles();
    });
});

document.querySelector('#open-add-dialog').addEventListener('click', () => {
    fillAssigneeOptions();
    document.querySelector('#add-error').textContent = '';
    textInput.value = '';
    statusSelect.value = 'false';
    addDialog.showModal();
});
document.querySelector('#cancel-add').addEventListener('click', () => addDialog.close());
addDialog.addEventListener('cancel', (event) => { if (busy) event.preventDefault(); });

todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = textInput.value.trim();
    const assignedUserId = Number(assigneeSelect.value);
    const completed = statusSelect.value === 'true';
    if (!text || text.length > 300) {
        document.querySelector('#add-error').textContent = 'Тапсырма мәтінін енгізіңіз (1–300 таңба).';
        return;
    }
    if (userId === null || !Number.isSafeInteger(assignedUserId) || assignedUserId < 1) {
        document.querySelector('#add-error').textContent = 'Орындаушыны таңдаңыз.';
        return;
    }
    action(async () => {
        const added = await request('/todos/add', 'POST', { todo: text, completed, userId: assignedUserId });
        todos.unshift({ id: added.id, key: crypto.randomUUID(), userId: assignedUserId, todo: text, completed, local: true });
        if (!loadedOwners.includes(assignedUserId)) loadedOwners.push(assignedUserId);
        textInput.value = '';
        document.querySelector('#filter').value = 'all';
        save(); render();
        if (profileDialog.open) renderProfile(openProfileId);
        addDialog.close();
    });
});
document.querySelector('#cancel-edit').addEventListener('click', cancelEdit);
dialog.addEventListener('cancel', (event) => { if (busy) event.preventDefault(); });
document.querySelector('#edit-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = editInput.value.trim();
    if (!text) {
        document.querySelector('#edit-error').textContent = 'Тапсырма мәтінін енгізіңіз.';
        return;
    }
    action(async () => {
        const todo = todos.find((item) => item.key === editingKey);
        try {
            if (!todo) throw new Error('Тапсырма табылмады');
            if (!todo.local) await request(`/todos/${todo.id}`, 'PATCH', { todo: text });
            todo.todo = text;
            save();
            render();
            if (profileDialog.open) {
                renderProfile(openProfileId);
            }
            cancelEdit();
        } catch (error) {
            document.querySelector('#edit-error').textContent = 'Сақталмады. Қайта көріңіз.';
            throw error;
        }
    });
});
document.querySelector('#filter').addEventListener('change', render);
document.querySelector('#sort').addEventListener('change', render);
