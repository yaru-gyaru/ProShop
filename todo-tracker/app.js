const API = 'https://dummyjson.com';
const userForm = document.querySelector('#user-form');
const todoForm = document.querySelector('#todo-form');
const textInput = document.querySelector('#todo-text');
const list = document.querySelector('#todos');
const message = document.querySelector('#message');
let userId = null;
let loadedOwners = [];
let todos = [];
let editingKey = null;
let busy = false;
const dialog = document.querySelector('#edit-dialog');
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
        content.append(title, meta);
        const actions = document.createElement('div');
        actions.className = 'actions';
        const edit = document.createElement('button');
        edit.className = 'secondary';
        edit.textContent = 'Өзгерту';
        edit.addEventListener('click', () => {
            editingKey = todo.key;
            editInput.value = todo.todo;
            document.querySelector('#edit-error').textContent = '';
            dialog.showModal();
        });
        const remove = document.createElement('button');
        remove.className = 'secondary';
        remove.textContent = 'Жою';
        remove.addEventListener('click', () => {
            if (!confirm(`«${todo.todo}» тапсырмасын жою керек пе?`)) return;
            action(async () => {
                if (!todo.local) await request(`/todos/${todo.id}`, 'DELETE');
                todos = todos.filter((item) => item.key !== todo.key);
                if (editingKey === todo.key) cancelEdit();
                save(); render();
            });
        });
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
        todoForm.hidden = id === 0;
        render();
        tell(cached ? 'API жүктелді. Сақталған өзгерістер көрсетілді.' : 'Тапсырмалар API арқылы жүктелді.');
    });
});

todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = textInput.value.trim();
    if (!text || text.length > 300 || (userId === null || userId === 0)) return tell('Тапсырма мәтінін енгізіңіз (1–300 таңба).', true);
    action(async () => {
        const added = await request('/todos/add', 'POST', { todo: text, completed: false, userId });
        todos.unshift({ id: added.id, key: crypto.randomUUID(), userId, todo: text, completed: false, local: true });
        textInput.value = '';
        document.querySelector('#filter').value = 'all';
        save(); render();
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
            save(); render(); cancelEdit();
        } catch (error) {
            document.querySelector('#edit-error').textContent = 'Сақталмады. Қайта көріңіз.';
            throw error;
        }
    });
});
document.querySelector('#filter').addEventListener('change', render);
document.querySelector('#sort').addEventListener('change', render);
