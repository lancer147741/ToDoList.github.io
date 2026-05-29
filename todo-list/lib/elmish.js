// Собственный micro-framework в стиле Elm architecture

(function () {

    function createStore(initialState) {
      let state = initialState;
      const listeners = [];
  
      return {
        getState() {
          return state;
        },
  
        setState(newState) {
          state = newState;
  
          listeners.forEach(listener => listener(state));
        },
  
        subscribe(listener) {
          listeners.push(listener);
        }
      };
    }
  
    window.elmish = {
      createStore
    };
  
  })();
  