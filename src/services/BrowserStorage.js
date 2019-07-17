const BrowserStorage = {
  set,
  get,
  remove
};

function set(key, value) {
  //cookies.set(key, value, { path: '/'});
  LocalStorage.set(key, value);
}

function get(key) {
  //return cookies.get(key);
  return LocalStorage.get(key);
}

function remove(key) {
  //cookies.remove(key, { path: '/'})
  LocalStorage.remove(key);
}

const LocalStorage = {
  set: function(key, value) {
    localStorage.setItem(key, value);
  },
  get: function(key) {
    return localStorage.getItem(key);
  },
  remove: function(key) {
    localStorage.removeItem(key);
  }
};

export default BrowserStorage;
