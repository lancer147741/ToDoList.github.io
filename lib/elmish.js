// lib/elmish.js — адаптировано под одну страницу + localStorage
function empty (node) {
    while (node.lastChild) node.removeChild(node.lastChild);
  }
  
  function mount (model, update, view, root_element_id) {
    let ROOT = document.getElementById(root_element_id);
    let store_name = 'todos-elmish_' + root_element_id;
  
    function render (mod, signal, root) {
      localStorage.setItem(store_name, JSON.stringify(mod));
      empty(root);
      root.appendChild(view(mod, signal));
    }
  
    function signal(action, data) {
      return function callback() {
        let model = JSON.parse(localStorage.getItem(store_name) || JSON.stringify({ todos: [] }));
        let updatedModel = update(action, model, data);
        render(updatedModel, signal, ROOT);
      };
    }
  
    let model = JSON.parse(localStorage.getItem(store_name)) || model;
    render(model, signal, ROOT);
  }
  
  // Экспорт для совместимости с todo-app.js
  window.elmish = { mount, empty };
  