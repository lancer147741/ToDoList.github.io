const STORAGE_KEY = 'todos-storage';

const initialState = {
  todos: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
  filter: 'all'
};

const store = elmish.createStore(initialState);

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function setState(newState) {
  saveTodos(newState.todos);
  store.setState(newState);
}

function addTodo(title) {
  const state = store.getState();

  const todo = {
    id: Date.now(),
    title,
    done: false
  };

  setState({
    ...state,
    todos: [todo, ...state.todos]
  });
}

function toggleTodo(id) {
  const state = store.getState();

  const todos = state.todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        done: !todo.done
      };
    }

    return todo;
  });

  setState({
    ...state,
    todos
  });
}

function deleteTodo(id) {
  const state = store.getState();

  const todos = state.todos.filter(todo => todo.id !== id);

  setState({
    ...state,
    todos
  });
}

function editTodo(id, title) {
  const state = store.getState();

  const todos = state.todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        title
      };
    }

    return todo;
  });

  setState({
    ...state,
    todos
  });
}

function clearCompleted() {
  const state = store.getState();

  const todos = state.todos.filter(todo => !todo.done);

  setState({
    ...state,
    todos
  });
}

function setFilter(filter) {
  const state = store.getState();

  setState({
    ...state,
    filter
  });
}

function getFilteredTodos(state) {
  switch (state.filter) {
    case 'active':
      return state.todos.filter(todo => !todo.done);

    case 'completed':
      return state.todos.filter(todo => todo.done);

    default:
      return state.todos;
  }
}

function render(state) {
  const list = document.getElementById('todo-list');
  const count = document.getElementById('todo-count');

  list.innerHTML = '';

  const filteredTodos = getFilteredTodos(state);

  filteredTodos.forEach(todo => {

    const li = document.createElement('li');

    if (todo.done) {
      li.classList.add('completed');
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;

    checkbox.addEventListener('change', () => {
      toggleTodo(todo.id);
    });

    const title = document.createElement('span');
    title.className = 'todo-title';
    title.textContent = todo.title;

    title.addEventListener('dblclick', () => {

      const input = document.createElement('input');
      input.className = 'edit-input';
      input.value = todo.title;

      li.innerHTML = '';
      li.appendChild(input);

      input.focus();

      input.addEventListener('keydown', (e) => {

        if (e.key === 'Enter') {
          editTodo(todo.id, input.value.trim());
        }

      });

    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'destroy';
    removeBtn.textContent = '×';

    removeBtn.addEventListener('click', () => {
      deleteTodo(todo.id);
    });

    wrapper.appendChild(checkbox);
    wrapper.appendChild(title);
    wrapper.appendChild(removeBtn);

    li.appendChild(wrapper);

    list.appendChild(li);
  });

  const activeCount = state.todos.filter(todo => !todo.done).length;

  count.innerHTML = `<strong>${activeCount}</strong> задач осталось`;

  document.querySelectorAll('.filters a').forEach(link => {
    link.classList.remove('selected');

    if (link.dataset.filter === state.filter) {
      link.classList.add('selected');
    }
  });
}

store.subscribe(render);

render(store.getState());

const input = document.getElementById('new-todo');

input.addEventListener('keydown', (e) => {

  if (e.key === 'Enter') {

    const title = input.value.trim();

    if (!title) {
      return;
    }

    addTodo(title);

    input.value = '';
  }

});

document.querySelectorAll('.filters a').forEach(link => {

  link.addEventListener('click', (e) => {
    e.preventDefault();

    setFilter(link.dataset.filter);
  });

});

document.getElementById('clear-completed')
  .addEventListener('click', clearCompleted);
