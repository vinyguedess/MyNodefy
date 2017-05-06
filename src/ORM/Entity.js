class Entity {
  get(key) {
    return this[key];
  }

  set(key, value) {
    if (typeof key === "object") {
      Object.keys(key).map(k => {
        this[k] = key[k];
      });
      return;
    }

    this[key] = value;
  }
}

module.exports = Entity;
