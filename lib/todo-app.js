// lib/todo-app.js
import { mount } from './elmish.js';

const init = () => {
  const saved = localStorage.getItem('todos');
  return saved ? JSON.parse(saved) : [];
};

const update = (todos, msg) => {
  switch (msg.type) {
    case 'ADD':
      return [...todos, { id: Date.now(), title: msg.title, done: false }];
    case 'TOGGLE':
      return todos.map(t => t.id === msg.id ? { ...t, done: !t.done } : t);
    case 'EDIT':
      return todos.map(t => t.id === msg.id ? { ...t, title: msg.title } : t);
    case 'DELETE':
      return todos.filter(t => t.id !== msg.id);
    case 'CLEAR':
      return todos.filter(t => !t.done);
    case 'SET_FILTER':
      return { ...todos, filter: msg.filter };
    default:
      return todos;
  }
};

const view = (todos) => {
  const filtered = todos.filter(t => {
    if (todos.filter === 'active') return !t.done;
    if (todos.filter === 'completed') return t.done;
    return true;
  });

  const htmlItems = filtered.map(t => `
    <li>
      <input type="checkbox" ${t.done ? 'checked' : ''} onchange="window.dispatch({type:'TOGGLE', id:${t.id}})">
      <span contenteditable="false" ondblclick="this.contentEditable=true; this.focus()" onblur="window.dispatch({type:'EDIT', id:${t.id}, title:this.textContent})">${t.title}</span>
      <button onclick="window.dispatch({type:'DELETE', id:${t.id}})" class="destroy">×</button>
    </li>`).join('');

  return `
    <div id="todo-list" class="todo-list">
      ${htmlItems}
    </div>`;
};

mount('todo-list', init, update, view);

// Глобальный dispatch для браузерных событий
window.dispatch = (msg) => {
  let todos = JSON.parse(localStorage.getItem('todos') || '[]');
  const newState = update(todos, msg);
  localStorage.setItem('todos', JSON.stringify(newState));
  document.getElementById('todo-list').innerHTML = view(newState); // перерисовка
};

// Инициализация событий (добавлено для полной работоспособности)
window.onload = () => {
  // фильтры
  document.querySelectorAll('.filters a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.filters a').forEach(l => l.classList.remove('selected'));
      e.target.classList.add('selected');
      window.dispatch({type: 'SET_FILTER', filter: e.target.dataset.filter});
    });
  });

  // очистка
  document.getElementById('clear-completed').addEventListener('click', () => {
    window.dispatch({type: 'CLEAR'});
  });
};
