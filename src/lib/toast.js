let _notify = null;

export const toast = {
  success: (message) => _notify?.({ message, type: "success" }),
  error: (message) => _notify?.({ message, type: "error" }),
  _register: (fn) => { _notify = fn; },
};
