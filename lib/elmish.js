// lib/elmish.js
export const mount = (id, init, update, view) => {
    let state = init();
    const root = document.getElementById(id);
    const render = () => { root.innerHTML = view(state); attachEvents(); };
    const attachEvents = () => {
      // события уже привязаны в todo-app.js через глобальный dispatch
    };
    const dispatch = (msg) => {
      state = update(state, msg);
      render();
    };
    render();
  };
  