let _show = null;

export const dialog = {
  confirm: (message, options = {}) =>
    new Promise((resolve) => _show?.({ message, ...options }, resolve)),
  alert: (message, options = {}) =>
    new Promise((resolve) => _show?.({ message, ...options, alertOnly: true }, resolve)),
  _register: (fn) => { _show = fn; },
};
